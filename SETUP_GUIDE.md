# Setup Guide - Localhost with Supabase

## Changes Made

✅ **Updated all API URLs from remote server to localhost**

- Client now uses: `http://localhost:5000`
- Updated all hardcoded URLs in:
  - `AuthContext.js` (login & register)
  - `Customers.js`
  - `Items.js`
  - `Phones.js`
  - `Sales.js`
  - `Inventory.js`

✅ **Configured Supabase Database Connection**

- Server `.env` configured with:
  - Host: `aws-1-eu-west-3.pooler.supabase.com`
  - Port: `5432`
  - Database: `postgres`
  - User: `postgres.odbcchntrqbvhvvqowfz`
  - Password: `Swatpakistan811476`

## How to Run the Project

### 1. Start the Backend Server

```bash
cd server
npm install  # if you haven't already
npm start
```

The server will run on `http://localhost:5000`

### 2. Start the Frontend (in a new terminal)

```bash
cd client
npm install  # if you haven't already
npm start
```

The client will run on `http://localhost:3000`

### 3. Test the Connection

Once both are running:

1. Open `http://localhost:3000` in your browser
2. Try logging in - you should see:
   - No more connection timeout errors
   - Connection to your Supabase database via the local server

## Troubleshooting

### If you still get connection errors:

1. **Check server is running**: Visit `http://localhost:5000/api/health` - should return `{"status":"OK","message":"Phone Repair Shop API is running"}`

2. **Verify Supabase credentials**: Make sure your `.env` in the `server` folder has the correct credentials

3. **Port conflicts**: If port 5000 is in use, change the PORT in `server/.env` and update the client `.env` accordingly

### Environment Variables

**Server** (`server/.env`):

```
DB_HOST=aws-1-eu-west-3.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.odbcchntrqbvhvvqowfz
DB_PASSWORD=Swatpakistan811476
DB_NAME=postgres
```

**Client** (`client/.env`):

```
REACT_APP_API_URL=http://localhost:5000
```

## Next Steps

- Test the login functionality
- Verify all API calls work (customers, items, phones, sales, inventory)
- If using the client build, run `npm run build` in the client folder after changes
