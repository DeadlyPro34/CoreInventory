from rest_framework import serializers

from .models import ActivityLog, Delivery, Inventory, InventoryLog, Product, Request, Supplier


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ("id", "name", "email", "phone", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "name", "sku", "unit_cost", "reorder_level", "is_active", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class RequestSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)
    approved_by_username = serializers.SerializerMethodField()

    def get_approved_by_username(self, obj):
        return obj.approved_by.username if obj.approved_by else None

    class Meta:
        model = Request
        fields = (
            "id",
            "product",
            "quantity",
            "supplier",
            "status",
            "created_by",
            "created_by_username",
            "approved_by",
            "approved_by_username",
            "approval_note",
            "approved_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "status",
            "created_by",
            "approved_by",
            "approved_at",
            "created_at",
            "updated_at",
        )


class RequestApprovalSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["approve", "reject"])
    approval_note = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class DeliverySerializer(serializers.ModelSerializer):
    request_status = serializers.CharField(source="request.status", read_only=True)

    class Meta:
        model = Delivery
        fields = (
            "id",
            "request",
            "request_status",
            "status",
            "created_by",
            "delivered_at",
            "stock_applied",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_by", "delivered_at", "stock_applied", "created_at", "updated_at")

    def validate(self, attrs):
        request_obj = attrs.get("request")
        if request_obj and request_obj.status != Request.Status.APPROVED:
            raise serializers.ValidationError("Cannot create delivery for a non-approved request.")
        return attrs


class DeliveryStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Delivery.Status.choices)


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_sku = serializers.CharField(source="product.sku", read_only=True)

    class Meta:
        model = Inventory
        fields = ("id", "product", "product_name", "product_sku", "quantity_on_hand", "created_at", "updated_at")
        read_only_fields = ("id", "quantity_on_hand", "created_at", "updated_at")


class InventoryLogSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    actor_username = serializers.CharField(source="actor.username", read_only=True)

    class Meta:
        model = InventoryLog
        fields = (
            "id",
            "product",
            "product_name",
            "delivery",
            "quantity_before",
            "quantity_change",
            "quantity_after",
            "actor",
            "actor_username",
            "note",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class ActivityLogSerializer(serializers.ModelSerializer):
    actor_username = serializers.CharField(source="actor.username", read_only=True)

    class Meta:
        model = ActivityLog
        fields = ("id", "actor", "actor_username", "action", "target_type", "target_id", "metadata", "created_at")
        read_only_fields = fields
