// Dynamic form configurations for different asset types and forms

export const assetFormConfig = {
  title: "Add New Asset",
  fields: [
    {
      name: 'asset_code',
      label: 'Asset Code',
      type: 'text',
      required: true,
      icon: true,
      placeholder: 'e.g., LAPTOP-001, TV-001',
      helpText: 'Unique identifier',
      suggestions: ['LAPTOP-', 'TV-', 'PHONE-', 'FURNITURE-', 'APPLIANCE-'],
      autoComplete: 'off'
    },
    {
      name: 'asset_name',
      label: 'Asset Name',
      type: 'text',
      required: true,
      icon: true,
      placeholder: 'e.g., MacBook Pro 16", Samsung 55" TV',
      helpText: 'Descriptive name',
      suggestions: [
        'MacBook Pro 16"',
        'Samsung 55" Smart TV',
        'iPhone 15 Pro',
        'Dell XPS 13',
        'IKEA Hemnes Bed',
        'KitchenAid Mixer',
        'Dyson Vacuum',
        'Sony WH-1000XM4'
      ]
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select category',
      helpText: 'Asset category'
    },
    {
      name: 'location',
      label: 'Physical Location',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select location',
      helpText: 'Where it\'s stored'
    },
    {
      name: 'vendor',
      label: 'Vendor/Store',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select vendor',
      helpText: 'Where you bought it'
    },
    {
      name: 'purchase_date',
      label: 'Purchase Date',
      type: 'date',
      required: true,
      icon: true,
      helpText: 'When you bought it'
    },
    {
      name: 'cost',
      label: 'Purchase Cost',
      type: 'number',
      required: true,
      icon: true,
      placeholder: '0.00',
      helpText: 'How much you paid',
      min: 0,
      step: 0.01
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select status',
      helpText: 'Current condition'
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'text',
      required: false,
      icon: true,
      placeholder: 'e.g., Apple, Samsung, Dell',
      suggestions: [
        'Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Sony', 'LG', 'Panasonic',
        'IKEA', 'West Elm', 'Crate & Barrel', 'KitchenAid', 'Dyson', 'Dyson',
        'Toyota', 'Honda', 'BMW', 'Mercedes', 'Nike', 'Adidas'
      ]
    },
    {
      name: 'model_number',
      label: 'Model Number',
      type: 'text',
      required: false,
      icon: true,
      placeholder: 'e.g., MBP16-2023, QN55Q80A',
      helpText: 'Product model'
    },
    {
      name: 'serial_number',
      label: 'Serial Number',
      type: 'text',
      required: false,
      icon: true,
      placeholder: 'e.g., ABC123456789',
      helpText: 'Unique serial number'
    },
    {
      name: 'end_of_life_date',
      label: 'Expected End of Life',
      type: 'date',
      required: false,
      icon: true,
      helpText: 'When you expect to replace it'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      icon: true,
      placeholder: 'Additional details about this asset...',
      helpText: 'Any additional information',
      rows: 3
    }
  ],
  fileFields: [
    {
      name: 'purchase_receipt',
      label: 'Purchase Receipt',
      accept: 'image/*,.pdf',
      maxSize: 5 * 1024 * 1024, // 5MB
      helpText: 'Receipt, invoice, or proof of purchase'
    },
    {
      name: 'manual_document',
      label: 'User Manual/Documentation',
      accept: '.pdf,.doc,.docx,image/*',
      maxSize: 10 * 1024 * 1024, // 10MB
      helpText: 'User manual, warranty card, or other documentation'
    }
  ]
};

export const warrantyFormConfig = {
  title: "Add New Warranty",
  fields: [
    {
      name: 'asset',
      label: 'Asset',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select asset',
      helpText: 'Which asset this warranty covers'
    },
    {
      name: 'warranty_provider',
      label: 'Warranty Provider',
      type: 'text',
      required: false,
      icon: true,
      placeholder: 'e.g., Apple, Samsung, Dell',
      suggestions: [
        'Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Sony', 'LG', 'Panasonic',
        'KitchenAid', 'Dyson', 'Bosch', 'Whirlpool', 'GE', 'Maytag',
        'Toyota', 'Honda', 'BMW', 'Mercedes', 'Nike', 'Adidas'
      ]
    },
    {
      name: 'start_date',
      label: 'Warranty Start Date',
      type: 'date',
      required: true,
      icon: true,
      helpText: 'When warranty begins'
    },
    {
      name: 'end_date',
      label: 'Warranty End Date',
      type: 'date',
      required: true,
      icon: true,
      helpText: 'When warranty expires'
    },
    {
      name: 'coverage_details',
      label: 'Coverage Details',
      type: 'textarea',
      required: false,
      icon: true,
      placeholder: 'Describe what is covered under this warranty...',
      helpText: 'What the warranty covers',
      rows: 3
    },
    {
      name: 'contact_info',
      label: 'Contact Information',
      type: 'textarea',
      required: false,
      icon: true,
      placeholder: 'Warranty provider contact details...',
      helpText: 'How to contact for warranty claims',
      rows: 2
    }
  ],
  fileFields: [
    {
      name: 'warranty_document',
      label: 'Warranty Document',
      accept: 'image/*,.pdf',
      maxSize: 5 * 1024 * 1024, // 5MB
      helpText: 'Warranty card, certificate, or documentation'
    }
  ]
};

export const maintenanceFormConfig = {
  title: "Add New Maintenance Record",
  fields: [
    {
      name: 'asset',
      label: 'Asset',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select asset',
      helpText: 'Which asset was maintained'
    },
    {
      name: 'maintenance_type',
      label: 'Maintenance Type',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select type',
      helpText: 'Type of maintenance performed',
      options: [
        { value: 'preventive', label: 'Preventive' },
        { value: 'corrective', label: 'Corrective' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'upgrade', label: 'Upgrade' },
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'inspection', label: 'Inspection' }
      ]
    },
    {
      name: 'performed_on',
      label: 'Performed On',
      type: 'date',
      required: true,
      icon: true,
      helpText: 'When maintenance was done'
    },
    {
      name: 'performed_by',
      label: 'Performed By',
      type: 'text',
      required: true,
      icon: true,
      placeholder: 'e.g., John Smith or ABC Maintenance Co.',
      suggestions: [
        'Self', 'Professional Service', 'Authorized Dealer',
        'Local Repair Shop', 'Friend/Family', 'Online Service'
      ]
    },
    {
      name: 'cost',
      label: 'Cost',
      type: 'number',
      required: false,
      icon: true,
      placeholder: '0.00',
      helpText: 'How much it cost',
      min: 0,
      step: 0.01
    },
    {
      name: 'next_maintenance_date',
      label: 'Next Maintenance Date',
      type: 'date',
      required: false,
      icon: true,
      helpText: 'When next maintenance is due'
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      required: false,
      icon: true,
      placeholder: 'Describe the maintenance work performed...',
      helpText: 'What was done',
      rows: 3
    }
  ]
};

export const depreciationFormConfig = {
  title: "Add New Depreciation Record",
  fields: [
    {
      name: 'asset',
      label: 'Asset',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select asset',
      helpText: 'Which asset to depreciate'
    },
    {
      name: 'method',
      label: 'Depreciation Method',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select method',
      helpText: 'How to calculate depreciation'
    },
    {
      name: 'rate',
      label: 'Depreciation Rate (%)',
      type: 'number',
      required: true,
      icon: true,
      placeholder: 'e.g., 10.00',
      helpText: 'Annual depreciation percentage',
      min: 0,
      max: 100,
      step: 0.01
    },
    {
      name: 'book_value',
      label: 'Book Value',
      type: 'number',
      required: true,
      icon: true,
      placeholder: '0.00',
      helpText: 'Current book value',
      min: 0,
      step: 0.01
    },
    {
      name: 'calculated_on',
      label: 'Calculated On',
      type: 'date',
      required: true,
      icon: true,
      helpText: 'Date of calculation'
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
      icon: true,
      placeholder: 'Additional notes about the depreciation calculation...',
      helpText: 'Any additional information',
      rows: 3
    }
  ]
};

export const invoiceFormConfig = {
  title: "Add New Invoice",
  fields: [
    {
      name: 'invoice_number',
      label: 'Invoice Number',
      type: 'text',
      required: true,
      icon: true,
      placeholder: 'e.g., INV-2024-001',
      helpText: 'Unique invoice number',
      suggestions: ['INV-', 'RECEIPT-', 'ORDER-']
    },
    {
      name: 'vendor',
      label: 'Vendor/Store',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select vendor',
      helpText: 'Who issued the invoice'
    },
    {
      name: 'invoice_date',
      label: 'Invoice Date',
      type: 'date',
      required: true,
      icon: true,
      helpText: 'Date on the invoice'
    },
    {
      name: 'total_amount',
      label: 'Total Amount',
      type: 'number',
      required: true,
      icon: true,
      placeholder: '0.00',
      helpText: 'Total amount on invoice',
      min: 0,
      step: 0.01
    },
    {
      name: 'currency',
      label: 'Currency',
      type: 'select',
      required: true,
      icon: true,
      placeholder: 'Select currency',
      helpText: 'Currency of the invoice',
      options: [
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'CAD', label: 'CAD - Canadian Dollar' },
        { value: 'AUD', label: 'AUD - Australian Dollar' },
        { value: 'INR', label: 'INR - Indian Rupee' }
      ]
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      icon: true,
      placeholder: 'What was purchased...',
      helpText: 'Description of items purchased',
      rows: 3
    }
  ],
  fileFields: [
    {
      name: 'invoice_file',
      label: 'Invoice File',
      accept: 'image/*,.pdf',
      maxSize: 5 * 1024 * 1024, // 5MB
      helpText: 'Upload the invoice or receipt'
    }
  ]
};

// Category-specific field configurations
export const getCategorySpecificFields = (categoryName) => {
  const categoryFields = {
    'Electronics': [
      {
        name: 'warranty_period',
        label: 'Warranty Period (months)',
        type: 'number',
        required: false,
        icon: true,
        placeholder: '12',
        helpText: 'Manufacturer warranty period',
        min: 0,
        max: 120
      },
      {
        name: 'power_consumption',
        label: 'Power Consumption (W)',
        type: 'number',
        required: false,
        icon: true,
        placeholder: '100',
        helpText: 'Power consumption in watts',
        min: 0
      }
    ],
    'Vehicles': [
      {
        name: 'license_plate',
        label: 'License Plate',
        type: 'text',
        required: false,
        icon: true,
        placeholder: 'ABC-1234',
        helpText: 'Vehicle license plate number'
      },
      {
        name: 'mileage',
        label: 'Mileage',
        type: 'number',
        required: false,
        icon: true,
        placeholder: '50000',
        helpText: 'Current mileage',
        min: 0
      },
      {
        name: 'fuel_type',
        label: 'Fuel Type',
        type: 'select',
        required: false,
        icon: true,
        placeholder: 'Select fuel type',
        options: [
          { value: 'gasoline', label: 'Gasoline' },
          { value: 'diesel', label: 'Diesel' },
          { value: 'electric', label: 'Electric' },
          { value: 'hybrid', label: 'Hybrid' },
          { value: 'lpg', label: 'LPG' }
        ]
      }
    ],
    'Furniture': [
      {
        name: 'material',
        label: 'Material',
        type: 'text',
        required: false,
        icon: true,
        placeholder: 'e.g., Wood, Metal, Plastic',
        suggestions: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Leather']
      },
      {
        name: 'dimensions',
        label: 'Dimensions (L x W x H)',
        type: 'text',
        required: false,
        icon: true,
        placeholder: 'e.g., 200cm x 80cm x 75cm',
        helpText: 'Length x Width x Height'
      }
    ],
    'Appliances': [
      {
        name: 'energy_rating',
        label: 'Energy Rating',
        type: 'select',
        required: false,
        icon: true,
        placeholder: 'Select rating',
        options: [
          { value: 'A+++', label: 'A+++' },
          { value: 'A++', label: 'A++' },
          { value: 'A+', label: 'A+' },
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' }
        ]
      },
      {
        name: 'capacity',
        label: 'Capacity',
        type: 'text',
        required: false,
        icon: true,
        placeholder: 'e.g., 25L, 7kg, 500W',
        helpText: 'Capacity or power rating'
      }
    ]
  };

  return categoryFields[categoryName] || [];
};
