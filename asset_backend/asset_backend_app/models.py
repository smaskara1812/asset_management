from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class AssetCategory(models.Model):
    """Master table for asset categories"""
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'asset_categories'
        verbose_name_plural = 'Asset Categories'
        ordering = ['category_name']

    def __str__(self):
        return self.category_name


class AssetStatus(models.Model):
    """Master table for asset statuses"""
    status_id = models.AutoField(primary_key=True)
    status_name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'asset_statuses'
        verbose_name_plural = 'Asset Statuses'
        ordering = ['status_name']

    def __str__(self):
        return self.status_name


class Location(models.Model):
    """Master table for locations"""
    location_id = models.AutoField(primary_key=True)
    location_name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations'
        verbose_name_plural = 'Locations'
        ordering = ['location_name']

    def __str__(self):
        return f"{self.location_name} - {self.address}"


class Vendor(models.Model):
    """Vendor information"""
    vendor_id = models.AutoField(primary_key=True)
    vendor_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vendors'
        verbose_name_plural = 'Vendors'
        ordering = ['vendor_name']

    def __str__(self):
        return self.vendor_name


class Asset(models.Model):
    """Main asset table"""
    asset_id = models.AutoField(primary_key=True)
    asset_code = models.CharField(max_length=50, unique=True, help_text="Unique barcode/QR code")
    asset_name = models.CharField(max_length=200)
    category = models.ForeignKey(AssetCategory, on_delete=models.CASCADE, related_name='assets')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='assets')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='assets')
    purchase_date = models.DateField()
    cost = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    status = models.ForeignKey(AssetStatus, on_delete=models.CASCADE, related_name='assets')
    end_of_life_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    model_number = models.CharField(max_length=100, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    # Purchase receipt as binary data
    purchase_receipt_data = models.BinaryField(blank=True, null=True, help_text="Purchase receipt as binary data")
    purchase_receipt_name = models.CharField(max_length=255, blank=True, null=True, help_text="Original filename")
    purchase_receipt_type = models.CharField(max_length=100, blank=True, null=True, help_text="MIME type of the file")
    purchase_receipt_size = models.IntegerField(blank=True, null=True, help_text="File size in bytes")
    # Manual document as binary data
    manual_document_data = models.BinaryField(blank=True, null=True, help_text="User manual as binary data")
    manual_document_name = models.CharField(max_length=255, blank=True, null=True, help_text="Original filename")
    manual_document_type = models.CharField(max_length=100, blank=True, null=True, help_text="MIME type of the file")
    manual_document_size = models.IntegerField(blank=True, null=True, help_text="File size in bytes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assets'
        verbose_name_plural = 'Assets'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.asset_name} ({self.asset_code})"


class Invoice(models.Model):
    """Invoice information"""
    invoice_id = models.AutoField(primary_key=True)
    invoice_number = models.CharField(max_length=100, unique=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='invoices')
    invoice_date = models.DateField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.CharField(max_length=3, default='USD')
    description = models.TextField(blank=True, null=True)
    invoice_file_data = models.BinaryField(blank=True, null=True, help_text="Invoice file as binary data")
    invoice_file_name = models.CharField(max_length=255, blank=True, null=True, help_text="Original filename")
    invoice_file_type = models.CharField(max_length=100, blank=True, null=True, help_text="MIME type of the file")
    invoice_file_size = models.IntegerField(blank=True, null=True, help_text="File size in bytes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'invoices'
        verbose_name_plural = 'Invoices'
        ordering = ['-invoice_date']

    def __str__(self):
        return f"{self.invoice_number} - {self.vendor.vendor_name}"


class AssetInvoiceMapping(models.Model):
    """Mapping between assets and invoices"""
    mapping_id = models.AutoField(primary_key=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='invoice_mappings')
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='asset_mappings')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'asset_invoice_mappings'
        verbose_name_plural = 'Asset Invoice Mappings'
        unique_together = ['asset', 'invoice']

    def __str__(self):
        return f"{self.asset.asset_name} - {self.invoice.invoice_number}"


class Warranty(models.Model):
    """Warranty information for assets"""
    warranty_id = models.AutoField(primary_key=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='warranties')
    start_date = models.DateField()
    end_date = models.DateField()
    coverage_details = models.TextField(blank=True, null=True)
    warranty_provider = models.CharField(max_length=200, blank=True, null=True)
    contact_info = models.TextField(blank=True, null=True)
    warranty_document_data = models.BinaryField(blank=True, null=True, help_text="Warranty document as binary data")
    warranty_document_name = models.CharField(max_length=255, blank=True, null=True, help_text="Original filename")
    warranty_document_type = models.CharField(max_length=100, blank=True, null=True, help_text="MIME type of the file")
    warranty_document_size = models.IntegerField(blank=True, null=True, help_text="File size in bytes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'warranties'
        verbose_name_plural = 'Warranties'
        ordering = ['-end_date']

    def __str__(self):
        return f"{self.asset.asset_name} - {self.start_date} to {self.end_date}"


class DepreciationMethod(models.Model):
    """Master table for depreciation methods"""
    method_id = models.AutoField(primary_key=True)
    method_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'depreciation_methods'
        verbose_name_plural = 'Depreciation Methods'
        ordering = ['method_name']

    def __str__(self):
        return self.method_name


class Depreciation(models.Model):
    """Depreciation tracking for assets"""
    depreciation_id = models.AutoField(primary_key=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='depreciations')
    method = models.ForeignKey(DepreciationMethod, on_delete=models.CASCADE, related_name='depreciations')
    rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Depreciation rate in percentage")
    book_value = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    calculated_on = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'depreciations'
        verbose_name_plural = 'Depreciations'
        ordering = ['-calculated_on']

    def __str__(self):
        return f"{self.asset.asset_name} - {self.method.method_name} ({self.calculated_on})"


class Maintenance(models.Model):
    """Maintenance records for assets"""
    MAINTENANCE_TYPES = [
        ('preventive', 'Preventive'),
        ('corrective', 'Corrective'),
        ('emergency', 'Emergency'),
        ('upgrade', 'Upgrade'),
    ]

    maintenance_id = models.AutoField(primary_key=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='maintenances')
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPES)
    performed_on = models.DateField()
    performed_by = models.CharField(max_length=200, help_text="Name of person/company who performed maintenance")
    cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    remarks = models.TextField(blank=True, null=True)
    next_maintenance_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'maintenances'
        verbose_name_plural = 'Maintenances'
        ordering = ['-performed_on']

    def __str__(self):
        return f"{self.asset.asset_name} - {self.maintenance_type} ({self.performed_on})"


class EndOfLife(models.Model):
    """End of life tracking for assets"""
    DISPOSAL_METHODS = [
        ('resold', 'Resold'),
        ('scrapped', 'Scrapped'),
        ('recycled', 'Recycled'),
        ('donated', 'Donated'),
        ('returned', 'Returned to Vendor'),
    ]

    eol_id = models.AutoField(primary_key=True)
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, related_name='end_of_life')
    eol_date = models.DateField()
    disposal_method = models.CharField(max_length=20, choices=DISPOSAL_METHODS)
    final_value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    remarks = models.TextField(blank=True, null=True)
    disposal_company = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'end_of_life'
        verbose_name_plural = 'End of Life Records'
        ordering = ['-eol_date']

    def __str__(self):
        return f"{self.asset.asset_name} - {self.disposal_method} ({self.eol_date})"
