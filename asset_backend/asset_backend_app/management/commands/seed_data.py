from django.core.management.base import BaseCommand
from asset_backend_app.models import (
    AssetCategory, AssetStatus, Location, Vendor,
    DepreciationMethod
)


class Command(BaseCommand):
    help = 'Seed the database with initial data for home/personal asset management'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with initial data...')
        
        # Create Asset Categories
        categories = [
            {'name': 'Electronics', 'description': 'TVs, laptops, phones, tablets, speakers, etc.'},
            {'name': 'Appliances', 'description': 'Refrigerators, washing machines, air conditioners, etc.'},
            {'name': 'Furniture', 'description': 'Chairs, tables, beds, sofas, cabinets, etc.'},
            {'name': 'Vehicles', 'description': 'Cars, motorcycles, bicycles, etc.'},
            {'name': 'Home & Garden', 'description': 'Ceiling fans, tools, garden equipment, etc.'},
            {'name': 'Luggage & Travel', 'description': 'Suitcases, backpacks, travel accessories, etc.'},
            {'name': 'Kitchen & Dining', 'description': 'Kitchen appliances, cookware, dining sets, etc.'},
            {'name': 'Office Equipment', 'description': 'Desks, chairs, printers, office supplies, etc.'},
            {'name': 'Sports & Fitness', 'description': 'Exercise equipment, sports gear, etc.'},
            {'name': 'Other', 'description': 'Miscellaneous items not fitting other categories'},
        ]
        
        for cat_data in categories:
            category, created = AssetCategory.objects.get_or_create(
                category_name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                self.stdout.write(f'Created category: {category.category_name}')
        
        # Create Asset Statuses
        statuses = [
            {'name': 'Active', 'description': 'Currently in use and functional'},
            {'name': 'In Storage', 'description': 'Stored but not currently in use'},
            {'name': 'Under Repair', 'description': 'Currently being repaired or serviced'},
            {'name': 'Retired', 'description': 'No longer in use but kept for reference'},
            {'name': 'Sold', 'description': 'Sold or disposed of'},
            {'name': 'Lost/Stolen', 'description': 'Missing or stolen'},
        ]
        
        for status_data in statuses:
            status, created = AssetStatus.objects.get_or_create(
                status_name=status_data['name'],
                defaults={'description': status_data['description']}
            )
            if created:
                self.stdout.write(f'Created status: {status.status_name}')
        
        
        # Create Locations
        locations = [
            {'name': 'Main House', 'address': '123 Main Street, City, State', 'city': 'City', 'state': 'State'},
            {'name': 'Garage', 'address': '123 Main Street, City, State', 'city': 'City', 'state': 'State'},
            {'name': 'Storage Unit', 'address': '456 Storage Ave, City, State', 'city': 'City', 'state': 'State'},
            {'name': 'Office Space', 'address': '789 Business Blvd, City, State', 'city': 'City', 'state': 'State'},
        ]
        
        for loc_data in locations:
            location, created = Location.objects.get_or_create(
                location_name=loc_data['name'],
                defaults={
                    'address': loc_data['address'],
                    'city': loc_data['city'],
                    'state': loc_data['state'],
                    'country': 'USA'
                }
            )
            if created:
                self.stdout.write(f'Created location: {location.location_name}')
        
        # Create Vendors (common retailers and brands)
        vendors = [
            {'name': 'Amazon', 'contact_person': 'Customer Service', 'email': 'support@amazon.com'},
            {'name': 'Best Buy', 'contact_person': 'Store Manager', 'email': 'support@bestbuy.com'},
            {'name': 'IKEA', 'contact_person': 'Customer Service', 'email': 'support@ikea.com'},
            {'name': 'Home Depot', 'contact_person': 'Store Manager', 'email': 'support@homedepot.com'},
            {'name': 'Apple Store', 'contact_person': 'Genius Bar', 'email': 'support@apple.com'},
            {'name': 'Samsung', 'contact_person': 'Customer Support', 'email': 'support@samsung.com'},
            {'name': 'Dell', 'contact_person': 'Customer Service', 'email': 'support@dell.com'},
            {'name': 'Costco', 'contact_person': 'Member Services', 'email': 'support@costco.com'},
            {'name': 'Target', 'contact_person': 'Guest Services', 'email': 'support@target.com'},
            {'name': 'Walmart', 'contact_person': 'Customer Service', 'email': 'support@walmart.com'},
            {'name': 'Local Electronics Store', 'contact_person': 'Store Owner', 'email': 'info@localelectronics.com'},
            {'name': 'Furniture Store', 'contact_person': 'Sales Manager', 'email': 'sales@furniturestore.com'},
        ]
        
        for vendor_data in vendors:
            vendor, created = Vendor.objects.get_or_create(
                vendor_name=vendor_data['name'],
                defaults={
                    'contact_person': vendor_data['contact_person'],
                    'email': vendor_data['email'],
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'Created vendor: {vendor.vendor_name}')
        
        # Create Depreciation Methods
        depreciation_methods = [
            {'name': 'Straight Line', 'description': 'Equal depreciation each year over useful life'},
            {'name': 'Declining Balance', 'description': 'Higher depreciation in early years, decreasing over time'},
            {'name': 'Sum of Years Digits', 'description': 'Depreciation based on sum of years digits method'},
            {'name': 'Units of Production', 'description': 'Depreciation based on usage or production'},
            {'name': 'No Depreciation', 'description': 'Item does not depreciate (e.g., collectibles, art)'},
        ]
        
        for method_data in depreciation_methods:
            method, created = DepreciationMethod.objects.get_or_create(
                method_name=method_data['name'],
                defaults={'description': method_data['description']}
            )
            if created:
                self.stdout.write(f'Created depreciation method: {method.method_name}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully seeded database with initial data!')
        )
