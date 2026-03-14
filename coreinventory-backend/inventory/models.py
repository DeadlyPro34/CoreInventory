from django.db import models

class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=255)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='locations')
    
    def __str__(self):
        return f"{self.warehouse.name} - {self.name}"

class Product(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True)
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stock_on_hand = models.IntegerField(default=0)
    category_icon = models.CharField(max_length=50, default='box')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class InventoryMove(models.Model):
    MOVE_TYPES = (
        ('receipt', 'Receipt'),
        ('delivery', 'Delivery'),
    )
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('waiting', 'Waiting'),
        ('ready', 'Ready'),
        ('done', 'Done'),
    )
    
    reference = models.CharField(max_length=100, unique=True)
    move_type = models.CharField(max_length=10, choices=MOVE_TYPES)
    source = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    partner = models.CharField(max_length=255)
    schedule_date = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.reference

class MoveLine(models.Model):
    move = models.ForeignKey(InventoryMove, on_delete=models.CASCADE, related_name='lines')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    
    def __str__(self):
        return f"{self.move.reference} - {self.product.name}"
