# MongoDB Integration Guide for Scoop Lovers OMS

## Overview
This document outlines how to integrate MongoDB with the Scoop Lovers Order Management System to replace the current in-memory database with persistent cloud storage.

## Current Architecture
- **Frontend:** React (in `src/App.jsx`)
- **Database:** In-memory with localStorage persistence
- **Storage:** Browser localStorage (not suitable for production)

## Target Architecture with MongoDB
- **Frontend:** React (no changes needed)
- **Backend:** Node.js/Express (see `backend_api_example.js`)
- **Database:** MongoDB Atlas (cloud) or MongoDB Community (self-hosted)
- **Storage:** MongoDB collections

## Step 1: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended for Production)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier available)
4. Get connection string in format: `mongodb+srv://username:password@cluster.mongodb.net/scoopLovers`

### Option B: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Connection string:
mongodb://localhost:27017/scoopLovers
```

## Step 2: Create Backend Server

### Create backend folder structure
```
project/
├── src/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── orders.js
│   │   ├── rateSheets.js
│   │   └── products.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── RateSheet.js
│   │   └── Product.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env.local
│   └── package.json
```

### Backend Setup (backend/server.js)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/rateSheets', require('./routes/rateSheets'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Backend package.json
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "mongodb": "^5.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Backend .env.local
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scoopLovers
JWT_SECRET=your_secret_key_here
PORT=5000
```

## Step 3: Create MongoDB Collections

Run these commands in MongoDB to set up collections:

```javascript
// Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "name", "phone"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { bsonType: "string", pattern: "^.+@.+$" },
        password: { bsonType: "string" },
        name: { bsonType: "string" },
        phone: { bsonType: "string" },
        role: { enum: ["manager", "ss", "distributor", "retailer"] },
        status: { enum: ["active", "inactive"] },
        district: { bsonType: "string" },
        ssId: { bsonType: ["objectId", "null"] },
        distId: { bsonType: ["objectId", "null"] },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// Create unique index on email
db.users.createIndex({ email: 1 }, { unique: true });

// Orders Collection
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "placedBy", "items", "grandTotal"],
      properties: {
        _id: { bsonType: "objectId" },
        id: { bsonType: "string" },
        placedBy: { bsonType: "objectId" },
        placedByName: { bsonType: "string" },
        role: { enum: ["ss", "distributor", "retailer"] },
        items: { 
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              productId: { bsonType: "objectId" },
              name: { bsonType: "string" },
              cartons: { bsonType: "int" },
              ssRate: { bsonType: "double" },
              distRate: { bsonType: "double" }
            }
          }
        },
        grandTotal: { bsonType: "double" },
        status: { enum: ["Draft", "Pending", "Completed", "Cancelled"] },
        excelFileName: { bsonType: "string" },
        rateSheetUsed: { bsonType: "object" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for fast querying
db.orders.createIndex({ placedBy: 1 });
db.orders.createIndex({ createdAt: -1 });

// Rate Sheets Collection
db.createCollection("rateSheets");
db.rateSheets.createIndex({ uploadedAt: -1 });
db.rateSheets.createIndex({ type: 1 });

// Products Collection
db.createCollection("products");
db.products.createIndex({ name: 1 });
db.products.createIndex({ category: 1 });
```

## Step 4: Update Frontend to Call API

Modify `src/App.jsx` to call backend instead of using in-memory DB:

```javascript
// Replace DB object with API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

async function signupUser(name, email, phone, password) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password, role: 'retailer' })
  });
  return response.json();
}

async function placeOrder(orderData) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return response.json();
}

async function uploadRateSheet(fileName, type, data) {
  const response = await fetch(`${API_BASE_URL}/rate-sheets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, type, data, uploadedAt: new Date() })
  });
  return response.json();
}
```

## Step 5: Deploy Backend

### Option A: Vercel (Recommended)
```bash
# Create api directory in project root
mkdir api
mv backend/* api/

# Deploy with Vercel
vercel deploy
```

### Option B: Heroku
```bash
# Create Procfile
echo "web: node backend/server.js" > Procfile

# Deploy
git push heroku main
```

### Option C: Render or Railway
- Connect GitHub repo
- Set environment variables
- Deploy

## Database Queries Reference

### Users
```javascript
// Find user by email
db.users.findOne({ email: "user@example.com" })

// Find all active users
db.users.find({ status: "active" })

// Find all super stockists
db.users.find({ role: "ss", status: "active" })

// Update user role
db.users.updateOne({ _id: ObjectId("...") }, { $set: { role: "distributor" } })
```

### Orders
```javascript
// Get user's orders
db.orders.find({ placedBy: ObjectId("...") })

// Get orders for specific date
db.orders.find({ createdAt: { $gte: new Date("2024-01-01") } })

// Update order status
db.orders.updateOne({ id: "ORD001" }, { $set: { status: "Completed" } })

// Get total revenue
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $group: { _id: null, total: { $sum: "$grandTotal" } } }
])
```

### Rate Sheets
```javascript
// Get latest SS rate sheet
db.rateSheets.findOne({ type: "ss", status: "active" }, { sort: { uploadedAt: -1 } })

// Get all distributor rate sheets
db.rateSheets.find({ type: "distributor" }).sort({ uploadedAt: -1 })
```

## Security Considerations

1. **Password Hashing:** Use bcryptjs before storing passwords
2. **Authentication:** Implement JWT tokens for API requests
3. **Authorization:** Validate user roles before allowing operations
4. **Input Validation:** Validate all incoming data
5. **HTTPS:** Always use HTTPS in production
6. **CORS:** Configure CORS properly for your domain
7. **Rate Limiting:** Add rate limiting to prevent abuse
8. **Error Handling:** Never expose sensitive information in errors

## Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify network access is allowed in MongoDB Atlas
- Check credentials in .env

### API Not Responding
- Check backend server is running: `npm start`
- Verify API URL in frontend matches backend
- Check CORS settings
- Check port is not already in use

### Data Not Persisting
- Verify MongoDB connection
- Check collection creation
- Verify write permissions in MongoDB

## Performance Optimization

1. **Indexes:** Create indexes on frequently queried fields
2. **Caching:** Implement caching for rate sheets
3. **Pagination:** Add pagination for large datasets
4. **Connection Pooling:** Configure MongoDB connection pooling
5. **Query Optimization:** Use aggregation pipeline for complex queries

## Maintenance

- **Regular Backups:** Enable MongoDB Atlas backups
- **Monitoring:** Set up monitoring alerts
- **Logging:** Implement comprehensive logging
- **Data Cleanup:** Remove old drafts and obsolete data
- **Security Updates:** Keep dependencies updated
