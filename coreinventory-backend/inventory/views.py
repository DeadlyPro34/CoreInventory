from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import ActivityLog, Delivery, Inventory, InventoryLog, Product, Request, Supplier
from .permissions import IsAdminOrManager
from .serializers import (
    ActivityLogSerializer,
    DeliverySerializer,
    DeliveryStatusSerializer,
    InventoryLogSerializer,
    InventorySerializer,
    ProductSerializer,
    RequestApprovalSerializer,
    RequestSerializer,
    SupplierSerializer,
)


class UserScopedViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        obj = serializer.save(user=self.request.user)
        self.log_action("created", obj)

    def perform_update(self, serializer):
        obj = serializer.save()
        self.log_action("updated", obj)

    def perform_destroy(self, instance):
        self.log_action("deleted", instance)
        instance.delete()

    def log_action(self, action, target_obj, metadata=None):
        ActivityLog.objects.create(
            user=self.request.user,
            actor=self.request.user,
            action=action,
            target_type=target_obj.__class__.__name__,
            target_id=target_obj.id,
            metadata=metadata or {},
        )


class SupplierViewSet(UserScopedViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class ProductViewSet(UserScopedViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        product = serializer.save(user=self.request.user)
        Inventory.objects.get_or_create(user=self.request.user, product=product)
        self.log_action("created", product, {"sku": product.sku})


class RequestViewSet(UserScopedViewSet):
    queryset = Request.objects.select_related("product", "supplier", "created_by", "approved_by")
    serializer_class = RequestSerializer

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]
        if product.user_id != self.request.user.id:
            raise ValidationError("Product must belong to the authenticated user.")
        supplier = serializer.validated_data.get("supplier")
        if supplier and supplier.user_id != self.request.user.id:
            raise ValidationError("Supplier must belong to the authenticated user.")
        req = serializer.save(user=self.request.user, created_by=self.request.user)
        self.log_action("created", req, {"status": req.status})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsAdminOrManager])
    def decide(self, request, pk=None):
        req = self.get_object()
        data = RequestApprovalSerializer(data=request.data)
        data.is_valid(raise_exception=True)

        if req.status != Request.Status.PENDING:
            raise ValidationError("Only pending requests can be approved or rejected.")

        decision = data.validated_data["action"]
        req.status = Request.Status.APPROVED if decision == "approve" else Request.Status.REJECTED
        req.approved_by = request.user
        req.approval_note = data.validated_data.get("approval_note")
        req.approved_at = timezone.now()
        req.save(update_fields=["status", "approved_by", "approval_note", "approved_at", "updated_at"])
        self.log_action("request_decision", req, {"decision": decision})

        return Response(RequestSerializer(req).data, status=status.HTTP_200_OK)


class DeliveryViewSet(UserScopedViewSet):
    queryset = Delivery.objects.select_related("request", "created_by", "request__product")
    serializer_class = DeliverySerializer

    def perform_create(self, serializer):
        req = serializer.validated_data["request"]
        if req.user_id != self.request.user.id:
            raise ValidationError("Request must belong to the authenticated user.")
        if req.status != Request.Status.APPROVED:
            raise ValidationError("Cannot create delivery without an approved request.")
        delivery = serializer.save(user=self.request.user, created_by=self.request.user)
        self.log_action("created", delivery, {"status": delivery.status, "request_id": req.id})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def set_status(self, request, pk=None):
        delivery = self.get_object()
        serializer = DeliveryStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        next_status = serializer.validated_data["status"]

        allowed = {
            Delivery.Status.PENDING: {Delivery.Status.IN_TRANSIT},
            Delivery.Status.IN_TRANSIT: {Delivery.Status.DELIVERED},
            Delivery.Status.DELIVERED: set(),
        }
        if next_status not in allowed[delivery.status]:
            raise ValidationError(f"Invalid status transition: {delivery.status} -> {next_status}")

        with transaction.atomic():
            delivery.status = next_status
            if next_status == Delivery.Status.DELIVERED:
                delivery.delivered_at = timezone.now()
            delivery.save(update_fields=["status", "delivered_at", "updated_at"])

            if next_status == Delivery.Status.DELIVERED and not delivery.stock_applied:
                inventory, _ = Inventory.objects.select_for_update().get_or_create(
                    user=request.user,
                    product=delivery.request.product,
                    defaults={"quantity_on_hand": 0},
                )
                before = inventory.quantity_on_hand
                change = delivery.request.quantity
                inventory.quantity_on_hand = before + change
                inventory.save(update_fields=["quantity_on_hand", "updated_at"])

                InventoryLog.objects.create(
                    user=request.user,
                    product=delivery.request.product,
                    delivery=delivery,
                    quantity_before=before,
                    quantity_change=change,
                    quantity_after=inventory.quantity_on_hand,
                    actor=request.user,
                    note="Stock updated from delivered request.",
                )
                delivery.stock_applied = True
                delivery.save(update_fields=["stock_applied", "updated_at"])

            self.log_action("delivery_status_updated", delivery, {"status": next_status})

        return Response(DeliverySerializer(delivery).data, status=status.HTTP_200_OK)


class InventoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Inventory.objects.select_related("product")

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=["get"])
    def low_stock(self, request):
        qs = self.get_queryset().filter(quantity_on_hand__lte=F("product__reorder_level"))
        return Response(InventorySerializer(qs, many=True).data, status=status.HTTP_200_OK)


class InventoryLogViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = InventoryLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = InventoryLog.objects.select_related("product", "delivery", "actor")

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class ActivityLogViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ActivityLog.objects.select_related("actor")

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class DashboardViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Request.objects.none()

    def list(self, request, *args, **kwargs):
        user = request.user
        data = {
            "pending_requests": Request.objects.filter(user=user, status=Request.Status.PENDING).count(),
            "approved_requests": Request.objects.filter(user=user, status=Request.Status.APPROVED).count(),
            "active_deliveries": Delivery.objects.filter(
                user=user, status__in=[Delivery.Status.PENDING, Delivery.Status.IN_TRANSIT]
            ).count(),
            "low_stock_alerts": Inventory.objects.filter(
                user=user, quantity_on_hand__lte=F("product__reorder_level")
            ).count(),
        }
        return Response(data, status=status.HTTP_200_OK)
