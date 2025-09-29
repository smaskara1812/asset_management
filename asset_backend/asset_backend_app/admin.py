from django.contrib import admin
from .models import (
    Asset, AssetCategory, AssetStatus, Location, Vendor,
    Invoice, AssetInvoiceMapping, Warranty, Depreciation, DepreciationMethod,
    Maintenance, EndOfLife
)


@admin.register(AssetCategory)
class AssetCategoryAdmin(admin.ModelAdmin):
    list_display = ['category_name', 'description']
    search_fields = ['category_name']


@admin.register(AssetStatus)
class AssetStatusAdmin(admin.ModelAdmin):
    list_display = ['status_name', 'description']
    search_fields = ['status_name']


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['location_name', 'address', 'city', 'state']
    search_fields = ['location_name', 'address', 'city']
    list_filter = ['city', 'state', 'country']


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['vendor_name', 'contact_person', 'contact_number', 'email', 'is_active']
    search_fields = ['vendor_name', 'contact_person', 'email']
    list_filter = ['is_active', 'city', 'state', 'country']


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = [
        'asset_code', 'asset_name', 'category', 'location',
        'vendor', 'purchase_date', 'cost', 'status'
    ]
    list_filter = ['category', 'location', 'vendor', 'status', 'purchase_date']
    search_fields = ['asset_code', 'asset_name', 'serial_number', 'model_number', 'brand']
    date_hierarchy = 'purchase_date'
    raw_id_fields = ['category', 'location', 'vendor', 'status']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'vendor', 'invoice_date', 'total_amount', 'currency']
    list_filter = ['vendor', 'invoice_date', 'currency']
    search_fields = ['invoice_number', 'vendor__vendor_name']
    date_hierarchy = 'invoice_date'
    raw_id_fields = ['vendor']


@admin.register(AssetInvoiceMapping)
class AssetInvoiceMappingAdmin(admin.ModelAdmin):
    list_display = ['asset', 'invoice', 'created_at']
    list_filter = ['created_at']
    search_fields = ['asset__asset_name', 'invoice__invoice_number']
    raw_id_fields = ['asset', 'invoice']


@admin.register(Warranty)
class WarrantyAdmin(admin.ModelAdmin):
    list_display = ['asset', 'start_date', 'end_date', 'warranty_provider']
    list_filter = ['start_date', 'end_date', 'warranty_provider']
    search_fields = ['asset__asset_name', 'warranty_provider']
    date_hierarchy = 'end_date'
    raw_id_fields = ['asset']


@admin.register(DepreciationMethod)
class DepreciationMethodAdmin(admin.ModelAdmin):
    list_display = ['method_name', 'description']
    search_fields = ['method_name']


@admin.register(Depreciation)
class DepreciationAdmin(admin.ModelAdmin):
    list_display = ['asset', 'method', 'rate', 'book_value', 'calculated_on']
    list_filter = ['method', 'calculated_on']
    search_fields = ['asset__asset_name', 'method__method_name']
    date_hierarchy = 'calculated_on'
    raw_id_fields = ['asset', 'method']


@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ['asset', 'maintenance_type', 'performed_on', 'performed_by', 'cost']
    list_filter = ['maintenance_type', 'performed_on', 'performed_by']
    search_fields = ['asset__asset_name', 'performed_by', 'remarks']
    date_hierarchy = 'performed_on'
    raw_id_fields = ['asset']


@admin.register(EndOfLife)
class EndOfLifeAdmin(admin.ModelAdmin):
    list_display = ['asset', 'eol_date', 'disposal_method', 'final_value', 'disposal_company']
    list_filter = ['disposal_method', 'eol_date', 'disposal_company']
    search_fields = ['asset__asset_name', 'disposal_company', 'remarks']
    date_hierarchy = 'eol_date'
    raw_id_fields = ['asset']
