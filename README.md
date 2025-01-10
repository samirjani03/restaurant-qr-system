# QR-Based Restaurant Ordering System

A modern digital ordering system that allows restaurant customers to scan QR codes at their tables and place orders directly through their phones.

## Features

- QR Code based table identification
- Digital menu with categories and items
- Real-time order tracking
- Kitchen order management
- Special instructions for orders
- Order status updates
- Mobile-responsive design

## Technical Stack

- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- Additional: QR Code Generation

## Project Structure
```
restaurant-ordering/
├── public/           # Public accessible files
│   ├── images/       # Store all images
│   ├── css/         # Stylesheet files
│   └── js/          # JavaScript files
├── src/             # Source code
│   ├── config/      # Configuration files
│   ├── controllers/ # Request handlers
│   ├── models/      # Database models
│   └── views/       # PHP view files
└── database/        # Database related files
```

## Setup Instructions

1. Clone the repository
2. Import database schema from `database/schema.sql`
3. Update database configuration in `src/config/database.php`
4. Set up a local PHP server pointing to the project root
5. Access the application through the browser

## API Endpoints

- GET `/api/tables/verify/{qrCode}` - Verify table QR code
- GET `/api/categories` - Get all menu categories
- GET `/api/menu-items` - Get all menu items
- GET `/api/menu-items?category={id}` - Get menu items by category
- POST `/api/orders` - Place new order
- GET `/api/orders/{id}/status` - Get order status

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.