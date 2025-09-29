# Asset Management Portal

A comprehensive asset management system built with Django REST Framework backend and React frontend.

## Features

### Core Entities
- **Assets**: Complete asset lifecycle management with barcode/QR code support
- **Asset Categories**: Organize assets by type (IT Equipment, Furniture, Vehicles, etc.)
- **Asset Status**: Track asset states (Active, Under Repair, Retired, Scrapped)
- **Departments**: Organizational structure management
- **Locations**: Physical location tracking with full address support
- **Vendors**: Supplier and vendor information management

### Financial Management
- **Invoices**: Purchase invoice tracking and management
- **Asset-Invoice Mapping**: Link multiple assets to single invoices
- **Warranties**: Warranty tracking with expiration alerts
- **Depreciation**: Multiple depreciation methods (Straight Line, Declining Balance)
- **Depreciation Methods**: Configurable depreciation calculation methods

### Maintenance & Lifecycle
- **Maintenance**: Comprehensive maintenance tracking (Preventive, Corrective, Emergency, Upgrade)
- **End of Life**: Asset disposal and retirement management

### User Interface
- **Dashboard**: Overview with key metrics and recent activities
- **Asset Management**: Full CRUD operations with advanced search and filtering
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Live data synchronization with backend

## Technology Stack

### Backend
- **Django 4.2.23**: Web framework
- **Django REST Framework**: API development
- **MySQL**: Database
- **django-cors-headers**: CORS handling

### Frontend
- **React 19.1.1**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling framework
- **Axios**: HTTP client
- **Lucide React**: Icon library

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- pip (Python package manager)
- npm (Node package manager)

## Installation & Setup

### 1. Database Setup

First, create the MySQL database:

```sql
CREATE DATABASE asset_management;
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd asset_backend
```

Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

Start the development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd asset_frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Assets
- `GET /api/assets/` - List all assets
- `POST /api/assets/` - Create new asset
- `GET /api/assets/{id}/` - Get asset details
- `PUT /api/assets/{id}/` - Update asset
- `DELETE /api/assets/{id}/` - Delete asset
- `GET /api/assets/search/?q={query}` - Search assets
- `GET /api/assets/by_status/?status_id={id}` - Filter by status
- `GET /api/assets/by_department/?department_id={id}` - Filter by department
- `GET /api/assets/by_category/?category_id={id}` - Filter by category

### Master Data
- `GET /api/categories/` - Asset categories
- `GET /api/statuses/` - Asset statuses
- `GET /api/departments/` - Departments
- `GET /api/locations/` - Locations
- `GET /api/vendors/` - Vendors
- `GET /api/vendors/active/` - Active vendors only

### Financial
- `GET /api/invoices/` - Invoices
- `GET /api/warranties/` - Warranties
- `GET /api/warranties/expiring_soon/?days={days}` - Expiring warranties
- `GET /api/depreciations/` - Depreciation records
- `GET /api/depreciation-methods/` - Depreciation methods

### Maintenance
- `GET /api/maintenances/` - Maintenance records
- `GET /api/maintenances/by_asset/?asset_id={id}` - Asset maintenance history
- `GET /api/end-of-life/` - End of life records

## Database Schema

The system includes the following main entities:

1. **Asset** - Core asset information
2. **AssetCategory** - Asset classification
3. **AssetStatus** - Asset state tracking
4. **Department** - Organizational units
5. **Location** - Physical locations
6. **Vendor** - Suppliers and vendors
7. **Invoice** - Purchase invoices
8. **AssetInvoiceMapping** - Asset-invoice relationships
9. **Warranty** - Warranty information
10. **Depreciation** - Depreciation tracking
11. **DepreciationMethod** - Depreciation calculation methods
12. **Maintenance** - Maintenance records
13. **EndOfLife** - Asset disposal tracking

## Usage

### Adding Assets

1. Navigate to the Assets page
2. Click "Add Asset"
3. Fill in the required information:
   - Asset Code (unique identifier)
   - Asset Name
   - Category, Department, Location, Vendor
   - Purchase Date and Cost
   - Status
   - Optional: Serial Number, Model Number, Brand, Description

### Managing Maintenance

1. Go to the Maintenance page
2. Click "Add Maintenance"
3. Select the asset and maintenance type
4. Record the maintenance details, cost, and performer

### Tracking Warranties

1. Access the Warranties page
2. Add warranty information for assets
3. Monitor expiring warranties on the dashboard

### Depreciation Management

1. Navigate to the Depreciation page
2. Set up depreciation methods
3. Record depreciation calculations for assets

## Development

### Backend Development

The backend follows Django best practices:
- Models in `asset_backend_app/models.py`
- API views in `asset_backend_app/views.py`
- Serializers in `asset_backend_app/serializers.py`
- URL patterns in `asset_backend_app/urls.py`

### Frontend Development

The frontend is organized as follows:
- Pages in `src/pages/`
- Components in `src/components/`
- API services in `src/services/`
- Styling with Tailwind CSS

### Adding New Features

1. Create/update Django models
2. Run migrations: `python manage.py makemigrations && python manage.py migrate`
3. Create/update serializers
4. Add API views
5. Update URL patterns
6. Create/update React components
7. Update API services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.
