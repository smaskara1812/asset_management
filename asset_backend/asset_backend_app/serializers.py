from rest_framework import serializers
import base64
from .models import (
    Asset, AssetCategory, AssetStatus, Location, Vendor,
    Invoice, AssetInvoiceMapping, Warranty, Depreciation, DepreciationMethod,
    Maintenance, EndOfLife
)


class AssetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetCategory
        fields = '__all__'


class AssetStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetStatus
        fields = '__all__'




class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'


class AssetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    status_name = serializers.CharField(source='status.status_name', read_only=True)
    location_name = serializers.CharField(source='location.location_name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True)
    
    # File fields as base64 encoded strings for API
    purchase_receipt_data = serializers.CharField(write_only=True, required=False, allow_blank=True)
    manual_document_data = serializers.CharField(write_only=True, required=False, allow_blank=True)
    purchase_receipt_data_read = serializers.SerializerMethodField(read_only=True)
    manual_document_data_read = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'

    def get_purchase_receipt_data_read(self, obj):
        if obj.purchase_receipt_data:
            return base64.b64encode(obj.purchase_receipt_data).decode('utf-8')
        return None
    
    def get_manual_document_data_read(self, obj):
        if obj.manual_document_data:
            return base64.b64encode(obj.manual_document_data).decode('utf-8')
        return None

    def create(self, validated_data):
        # Handle base64 file data
        if 'purchase_receipt_data' in validated_data and validated_data['purchase_receipt_data']:
            if isinstance(validated_data['purchase_receipt_data'], str):
                validated_data['purchase_receipt_data'] = base64.b64decode(validated_data['purchase_receipt_data'])
        
        if 'manual_document_data' in validated_data and validated_data['manual_document_data']:
            if isinstance(validated_data['manual_document_data'], str):
                validated_data['manual_document_data'] = base64.b64decode(validated_data['manual_document_data'])
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Handle base64 file data
        if 'purchase_receipt_data' in validated_data and validated_data['purchase_receipt_data']:
            if isinstance(validated_data['purchase_receipt_data'], str):
                validated_data['purchase_receipt_data'] = base64.b64decode(validated_data['purchase_receipt_data'])
        
        if 'manual_document_data' in validated_data and validated_data['manual_document_data']:
            if isinstance(validated_data['manual_document_data'], str):
                validated_data['manual_document_data'] = base64.b64decode(validated_data['manual_document_data'])
        
        return super().update(instance, validated_data)


class AssetListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    status_name = serializers.CharField(source='status.status_name', read_only=True)
    location_name = serializers.CharField(source='location.location_name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True)

    class Meta:
        model = Asset
        fields = [
            'asset_id', 'asset_code', 'asset_name', 'category_name', 'status_name',
            'location_name', 'vendor_name', 'purchase_date',
            'cost', 'end_of_life_date', 'created_at'
        ]


class InvoiceSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True)
    invoice_file_data = serializers.CharField(write_only=True, required=False, allow_blank=True)
    invoice_file_data_read = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'

    def get_invoice_file_data_read(self, obj):
        if obj.invoice_file_data:
            return base64.b64encode(obj.invoice_file_data).decode('utf-8')
        return None

    def create(self, validated_data):
        # Handle base64 file data
        if 'invoice_file_data' in validated_data and validated_data['invoice_file_data']:
            if isinstance(validated_data['invoice_file_data'], str):
                validated_data['invoice_file_data'] = base64.b64decode(validated_data['invoice_file_data'])
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Handle base64 file data
        if 'invoice_file_data' in validated_data and validated_data['invoice_file_data']:
            if isinstance(validated_data['invoice_file_data'], str):
                validated_data['invoice_file_data'] = base64.b64decode(validated_data['invoice_file_data'])
        
        return super().update(instance, validated_data)


class AssetInvoiceMappingSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)

    class Meta:
        model = AssetInvoiceMapping
        fields = '__all__'


class WarrantySerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    asset_code = serializers.CharField(source='asset.asset_code', read_only=True)
    warranty_document_data = serializers.CharField(write_only=True, required=False, allow_blank=True)
    warranty_document_data_read = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Warranty
        fields = '__all__'

    def get_warranty_document_data_read(self, obj):
        if obj.warranty_document_data:
            return base64.b64encode(obj.warranty_document_data).decode('utf-8')
        return None

    def create(self, validated_data):
        # Handle base64 file data
        if 'warranty_document_data' in validated_data and validated_data['warranty_document_data']:
            if isinstance(validated_data['warranty_document_data'], str):
                validated_data['warranty_document_data'] = base64.b64decode(validated_data['warranty_document_data'])
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Handle base64 file data
        if 'warranty_document_data' in validated_data and validated_data['warranty_document_data']:
            if isinstance(validated_data['warranty_document_data'], str):
                validated_data['warranty_document_data'] = base64.b64decode(validated_data['warranty_document_data'])
        
        return super().update(instance, validated_data)


class DepreciationMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepreciationMethod
        fields = '__all__'


class DepreciationSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    method_name = serializers.CharField(source='method.method_name', read_only=True)

    class Meta:
        model = Depreciation
        fields = '__all__'


class MaintenanceSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    asset_code = serializers.CharField(source='asset.asset_code', read_only=True)

    class Meta:
        model = Maintenance
        fields = '__all__'


class EndOfLifeSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    asset_code = serializers.CharField(source='asset.asset_code', read_only=True)

    class Meta:
        model = EndOfLife
        fields = '__all__'
