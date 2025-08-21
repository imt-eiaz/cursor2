# PhoneFix Pro - Phone Repair & Accessories Shop

A comprehensive web application for managing a phone repair and accessories shop built with the PERN stack (PostgreSQL, Express.js, React.js, Node.js) and styled with Tailwind CSS.

## Features

### 🔐 Authentication & User Management
- User registration and login system
- JWT-based authentication
- Role-based access control
- Secure password hashing with bcrypt

### 👥 Customer Management
- Customer registration and profile management
- Contact information storage (name, email, phone, address)
- Customer search and filtering
- Customer history tracking

### 📦 Item & Service Management
- Product and service catalog
- Category-based organization (Repair, Accessories, Parts)
- SKU management
- Pricing and cost tracking
- Detailed descriptions and specifications

### 🛒 Sales Management
- Transaction recording and tracking
- Customer association with sales
- Payment method tracking
- Sales history and reporting
- Automatic inventory updates

### 📊 Inventory Management
- Real-time stock tracking
- Low stock alerts
- Stock level monitoring
- Inventory movement logging
- Automated stock updates

### 📈 Dashboard & Analytics
- Overview statistics
- Recent sales tracking
- Low stock alerts
- Revenue calculations
- Quick action buttons

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd phone-repair-shop
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Database Setup
1. Create a PostgreSQL database:
```sql
CREATE DATABASE phone_repair_shop;
```

2. Copy the environment configuration:
```bash
cd server
cp env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=phone_repair_shop
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 4. Start the Application

#### Development Mode (Both Backend & Frontend)
```bash
npm run dev
```

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Items
- `GET /api/items` - Get all items
- `GET /api/items/category/:category` - Get items by category
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/date-range` - Get sales by date range
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Inventory
- `GET /api/inventory` - Get all inventory
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/item/:id` - Get inventory by item ID
- `PUT /api/inventory/:id` - Update inventory
- `POST /api/inventory/:id/add-stock` - Add stock
- `POST /api/inventory/:id/remove-stock` - Remove stock
- `GET /api/inventory/summary` - Get inventory summary

## Database Schema

The application automatically creates the following tables:

- **users** - User accounts and authentication
- **customers** - Customer information
- **items** - Products and services
- **inventory** - Stock levels and tracking
- **sales** - Transaction records

## Sample Data

The application comes with sample data including:
- Sample customers
- Common phone repair services
- Popular accessories
- Initial inventory levels

## Features in Detail

### Customer Registration
- Comprehensive customer profiles
- Email uniqueness validation
- Contact information management
- Customer search and filtering

### Item Management
- Product and service catalog
- Category organization
- SKU management
- Pricing and cost tracking

### Sales Processing
- Customer association
- Inventory validation
- Automatic stock updates
- Payment tracking
- Transaction history

### Inventory Control
- Real-time stock monitoring
- Low stock alerts
- Stock movement logging
- Automated updates

### Dashboard Analytics
- Key performance indicators
- Recent activity tracking
- Low stock notifications
- Quick action access

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Secure database connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

## Future Enhancements

- Advanced reporting and analytics
- Barcode scanning integration
- Customer appointment scheduling
- Multi-location support
- Mobile app development
- Payment gateway integration
- Email notifications
- Backup and restore functionality
