from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserOwnedModel(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="%(class)ss")

    class Meta:
        abstract = True


class Supplier(UserOwnedModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        indexes = [models.Index(fields=["user", "name"])]

    def __str__(self):
        return self.name


class Product(UserOwnedModel):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    reorder_level = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "sku"], name="uniq_product_sku_per_user"),
        ]
        indexes = [models.Index(fields=["user", "name"]), models.Index(fields=["user", "sku"])]

    def __str__(self):
        return f"{self.name} ({self.sku})"


class Inventory(UserOwnedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="inventories")
    quantity_on_hand = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "product"], name="uniq_inventory_product_per_user"),
        ]
        indexes = [models.Index(fields=["user", "quantity_on_hand"])]

    def __str__(self):
        return f"{self.product.sku}: {self.quantity_on_hand}"


class Request(UserOwnedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="requests")
    quantity = models.PositiveIntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name="requests")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_requests")
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name="approved_requests"
    )
    approval_note = models.TextField(blank=True, null=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["user", "status"]), models.Index(fields=["created_by"])]

    def __str__(self):
        return f"REQ-{self.id} ({self.status})"


class Delivery(UserOwnedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_TRANSIT = "in_transit", "In Transit"
        DELIVERED = "delivered", "Delivered"

    request = models.ForeignKey(Request, on_delete=models.PROTECT, related_name="deliveries")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_deliveries")
    delivered_at = models.DateTimeField(null=True, blank=True)
    stock_applied = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=["user", "status"]), models.Index(fields=["request"])]

    def clean(self):
        if self.request.status != Request.Status.APPROVED:
            raise ValidationError("Delivery can only be created for approved requests.")

    def __str__(self):
        return f"DEL-{self.id} ({self.status})"


class InventoryLog(UserOwnedModel):
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="inventory_logs")
    delivery = models.ForeignKey(Delivery, on_delete=models.PROTECT, related_name="inventory_logs")
    quantity_before = models.PositiveIntegerField()
    quantity_change = models.IntegerField()
    quantity_after = models.PositiveIntegerField()
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="inventory_actions")
    note = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        indexes = [models.Index(fields=["user", "product"]), models.Index(fields=["delivery"])]


class ActivityLog(UserOwnedModel):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="activity_logs")
    action = models.CharField(max_length=120)
    target_type = models.CharField(max_length=80)
    target_id = models.PositiveBigIntegerField()
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [models.Index(fields=["user", "action"]), models.Index(fields=["target_type", "target_id"])]
