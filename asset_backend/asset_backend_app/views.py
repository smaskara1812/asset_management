from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    Asset, AssetCategory, AssetStatus, Location, Vendor,
    Invoice, AssetInvoiceMapping, Warranty, Depreciation, DepreciationMethod,
    Maintenance, EndOfLife
)
from .serializers import (
    AssetSerializer, AssetListSerializer, AssetCategorySerializer, AssetStatusSerializer,
    LocationSerializer, VendorSerializer, InvoiceSerializer,
    AssetInvoiceMappingSerializer, WarrantySerializer, DepreciationSerializer,
    DepreciationMethodSerializer, MaintenanceSerializer, EndOfLifeSerializer
)


class AssetCategoryViewSet(viewsets.ModelViewSet):
    queryset = AssetCategory.objects.all()
    serializer_class = AssetCategorySerializer


class AssetStatusViewSet(viewsets.ModelViewSet):
    queryset = AssetStatus.objects.all()
    serializer_class = AssetStatusSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_vendors = Vendor.objects.filter(is_active=True)
        serializer = self.get_serializer(active_vendors, many=True)
        return Response(serializer.data)


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return AssetListSerializer
        return AssetSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            assets = Asset.objects.filter(
                Q(asset_name__icontains=query) |
                Q(asset_code__icontains=query) |
                Q(serial_number__icontains=query) |
                Q(model_number__icontains=query) |
                Q(brand__icontains=query)
            )
        else:
            assets = Asset.objects.all()
        
        serializer = AssetListSerializer(assets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        status_id = request.query_params.get('status_id')
        if status_id:
            assets = Asset.objects.filter(status_id=status_id)
            serializer = AssetListSerializer(assets, many=True)
            return Response(serializer.data)
        return Response({'error': 'status_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def by_department(self, request):
        department_id = request.query_params.get('department_id')
        if department_id:
            assets = Asset.objects.filter(department_id=department_id)
            serializer = AssetListSerializer(assets, many=True)
            return Response(serializer.data)
        return Response({'error': 'department_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_id = request.query_params.get('category_id')
        if category_id:
            assets = Asset.objects.filter(category_id=category_id)
            serializer = AssetListSerializer(assets, many=True)
            return Response(serializer.data)
        return Response({'error': 'category_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


class AssetInvoiceMappingViewSet(viewsets.ModelViewSet):
    queryset = AssetInvoiceMapping.objects.all()
    serializer_class = AssetInvoiceMappingSerializer


class WarrantyViewSet(viewsets.ModelViewSet):
    queryset = Warranty.objects.all()
    serializer_class = WarrantySerializer

    @action(detail=False, methods=['get'])
    def expiring_soon(self, request):
        from datetime import date, timedelta
        days_ahead = int(request.query_params.get('days', 30))
        future_date = date.today() + timedelta(days=days_ahead)
        
        warranties = Warranty.objects.filter(
            end_date__lte=future_date,
            end_date__gte=date.today()
        )
        serializer = self.get_serializer(warranties, many=True)
        return Response(serializer.data)


class DepreciationMethodViewSet(viewsets.ModelViewSet):
    queryset = DepreciationMethod.objects.all()
    serializer_class = DepreciationMethodSerializer


class DepreciationViewSet(viewsets.ModelViewSet):
    queryset = Depreciation.objects.all()
    serializer_class = DepreciationSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

    @action(detail=False, methods=['get'])
    def by_asset(self, request):
        asset_id = request.query_params.get('asset_id')
        if asset_id:
            maintenances = Maintenance.objects.filter(asset_id=asset_id)
            serializer = self.get_serializer(maintenances, many=True)
            return Response(serializer.data)
        return Response({'error': 'asset_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class EndOfLifeViewSet(viewsets.ModelViewSet):
    queryset = EndOfLife.objects.all()
    serializer_class = EndOfLifeSerializer
