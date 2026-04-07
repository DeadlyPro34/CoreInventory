from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
from rest_framework.routers import DefaultRouter
from inventory.views import (
    ActivityLogViewSet,
    DashboardViewSet,
    DeliveryViewSet,
    InventoryLogViewSet,
    InventoryViewSet,
    ProductViewSet,
    RequestViewSet,
    SupplierViewSet,
)

router = DefaultRouter()
router.register(r"suppliers", SupplierViewSet, basename="suppliers")
router.register(r"products", ProductViewSet, basename="products")
router.register(r"requests", RequestViewSet, basename="requests")
router.register(r"deliveries", DeliveryViewSet, basename="deliveries")
router.register(r"inventory", InventoryViewSet, basename="inventory")
router.register(r"inventory-logs", InventoryLogViewSet, basename="inventory-logs")
router.register(r"activity-logs", ActivityLogViewSet, basename="activity-logs")
router.register(r"dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", TemplateView.as_view(template_name="index.html"), name="index"),
    path("dashboard.html", TemplateView.as_view(template_name="dashboard.html"), name="dashboard"),
    path("api/auth/", include("accounts.urls")),
    path("api/", include(router.urls)),
]

# Serve static files from the frontend directory at the root
if settings.DEBUG:
    urlpatterns += [
        re_path(
            r"^(?P<path>.*)$",
            serve,
            {
                "document_root": settings.BASE_DIR.parent / "frontend",
            },
        ),
    ]
