/**
 * MongoDB Integration API Routes
 * These are example routes for a Node.js/Express backend that connects to MongoDB
 * 
 * To set up:
 * 1. Create a backend folder in the project root
 * 2. Install: npm install express mongodb dotenv cors
 * 3. Create .env with MONGODB_URI=your_connection_string
 * 4. Use these routes in your Express app
 */

const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scoopLovers';

async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client.db('scoopLovers');
}

// USERS API
// POST /api/users - Create a new user
router.post('/users', async (req, res) => {
  try {
    const db = await connectDB();
    const { name, email, password, phone, role, status, district } = req.body;
    
    // Validate email uniqueness
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const user = {
      name,
      email,
      password, // In production, use bcrypt to hash passwords
      phone,
      role: role || 'retailer',
      status: status || 'active',
      district: district || 'Nagpur',
      ssId: null,
      distId: null,
      createdAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(user);
    res.status(201).json({ ...user, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const { ObjectId } = require('mongodb');
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDERS API
// POST /api/orders - Create a new order
router.post('/orders', async (req, res) => {
  try {
    const db = await connectDB();
    const { id, placedBy, placedByName, role, items, grandTotal, excelFileName, rateSheetUsed } = req.body;
    
    const order = {
      id,
      placedBy,
      placedByName,
      role,
      items,
      grandTotal,
      status: 'Draft',
      excelFileName,
      rateSheetUsed,
      createdAt: new Date()
    };
    
    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ ...order, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders - Get all orders or filter by user
router.get('/orders', async (req, res) => {
  try {
    const db = await connectDB();
    const { placedBy, role } = req.query;
    let filter = {};
    
    if (placedBy) filter.placedBy = placedBy;
    if (role) filter.role = role;
    
    const orders = await db.collection('orders').find(filter).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RATE SHEETS API
// POST /api/rate-sheets - Upload rate sheet metadata
router.post('/rate-sheets', async (req, res) => {
  try {
    const db = await connectDB();
    const { fileName, type, uploadedBy, totalRows, data } = req.body;
    
    const rateSheet = {
      fileName,
      type, // 'ss' or 'distributor'
      uploadedBy,
      totalRows,
      data, // Raw parsed Excel data
      uploadedAt: new Date(),
      status: 'active'
    };
    
    const result = await db.collection('rateSheets').insertOne(rateSheet);
    res.status(201).json({ ...rateSheet, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rate-sheets - Get all active rate sheets
router.get('/rate-sheets', async (req, res) => {
  try {
    const db = await connectDB();
    const sheets = await db.collection('rateSheets').find({ status: 'active' }).toArray();
    res.json(sheets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PRODUCTS API
// POST /api/products - Update product rates from rate sheet
router.post('/products/update-rates', async (req, res) => {
  try {
    const db = await connectDB();
    const { updates } = req.body; // Array of { productId, ssRate, distRate }
    
    for (const update of updates) {
      await db.collection('products').updateOne(
        { _id: new ObjectId(update.productId) },
        { $set: { 
          ssRate: update.ssRate || undefined,
          distRate: update.distRate || undefined,
          updatedAt: new Date()
        }}
      );
    }
    
    res.json({ success: true, updatedCount: updates.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
