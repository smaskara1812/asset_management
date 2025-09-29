from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssetViewSet, AssetCategoryViewSet, AssetStatusViewSet,
    LocationViewSet, VendorViewSet, InvoiceViewSet, AssetInvoiceMappingViewSet,
    WarrantyViewSet, DepreciationViewSet, DepreciationMethodViewSet,
    MaintenanceViewSet, EndOfLifeViewSet
)

router = DefaultRouter()
router.register(r'assets', AssetViewSet)
router.register(r'categories', AssetCategoryViewSet)
router.register(r'statuses', AssetStatusViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'asset-invoice-mappings', AssetInvoiceMappingViewSet)
router.register(r'warranties', WarrantyViewSet)
router.register(r'depreciations', DepreciationViewSet)
router.register(r'depreciation-methods', DepreciationMethodViewSet)
router.register(r'maintenances', MaintenanceViewSet)
router.register(r'end-of-life', EndOfLifeViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
