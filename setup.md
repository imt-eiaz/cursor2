# Quick Setup Guide - PhoneFix Pro

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Database Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE phone_repair_shop;
```

2. Configure environment:
```bash
cd server
cp env.example .env
# Edit .env with your database credentials
```

### 3. Start Application
```bash
# Development mode (both backend & frontend)
npm run dev

# Or start separately:
npm run server    # Backend only
npm run client    # Frontend only
```

## Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Default Sample Data
The application comes with sample data including:
- Sample customers
- Common phone repair services
- Popular accessories
- Initial inventory levels

## First Login
Register a new account or use the sample data to explore the system.

## Features Available
✅ Customer Management  
✅ Item/Service Catalog  
✅ Sales Tracking  
✅ Inventory Management  
✅ Dashboard Analytics  
✅ User Authentication  

## Need Help?
Check the main README.md for detailed documentation and API endpoints.
