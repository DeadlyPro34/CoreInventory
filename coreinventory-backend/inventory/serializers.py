from rest_framework import serializers
from .models import Warehouse, Location, Product, InventoryMove, MoveLine

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class MoveLineSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    
    class Meta:
        model = MoveLine
        fields = '__all__'

class InventoryMoveSerializer(serializers.ModelSerializer):
    lines = MoveLineSerializer(many=True, read_only=True)
    
    class Meta:
        model = InventoryMove
        fields = '__all__'
