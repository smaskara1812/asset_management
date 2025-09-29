#!/bin/bash

echo "🏠 Setting up Personal Asset Management System..."
echo "================================================"

# Check if we're in the right directory
if [ ! -d "asset_backend" ] || [ ! -d "asset_frontend" ]; then
    echo "❌ Error: Please run this script from the asset_management directory"
    exit 1
fi

echo "📦 Setting up Backend..."
cd asset_backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Seed initial data
echo "Seeding initial data..."
python manage.py seed_data

echo "✅ Backend setup complete!"
echo ""

echo "📦 Setting up Frontend..."
cd ../asset_frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "🚀 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo "1. Backend: cd asset_backend && source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: cd asset_frontend && npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:8000"
echo "- Admin Panel: http://localhost:8000/admin"
echo ""
echo "Default categories include:"
echo "- Electronics (TVs, laptops, phones, speakers)"
echo "- Appliances (refrigerators, washing machines, air conditioners)"
echo "- Furniture (chairs, tables, beds, sofas)"
echo "- Vehicles (cars, motorcycles, bicycles)"
echo "- Home & Garden (ceiling fans, tools, garden equipment)"
echo "- Luggage & Travel (suitcases, backpacks, travel accessories)"
echo "- Kitchen & Dining (kitchen appliances, cookware, dining sets)"
echo "- Office Equipment (desks, chairs, printers, office supplies)"
echo "- Sports & Fitness (exercise equipment, sports gear)"
echo "- Other (miscellaneous items)"
echo ""
echo "Happy asset tracking! 🎉"
