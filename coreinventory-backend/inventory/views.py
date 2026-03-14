from rest_framework import viewsets, permissions
from .models import Warehouse, Location, Product, InventoryMove, MoveLine
from .serializers import (
    WarehouseSerializer, 
    LocationSerializer, 
    ProductSerializer, 
    InventoryMoveSerializer,
    MoveLineSerializer
)

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [permissions.AllowAny]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class InventoryMoveViewSet(viewsets.ModelViewSet):
    queryset = InventoryMove.objects.all()
    serializer_class = InventoryMoveSerializer
    permission_classes = [permissions.AllowAny]

class MoveLineViewSet(viewsets.ModelViewSet):
    queryset = MoveLine.objects.all()
    serializer_class = MoveLineSerializer
    permission_classes = [permissions.AllowAny]
