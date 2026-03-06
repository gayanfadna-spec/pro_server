const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/planning', require('./routes/planningRoutes'));
app.use('/api/grn', require('./routes/grnRoutes'));
app.use('/api/issue-notes', require('./routes/issueNoteRoutes'));
app.use('/api/packing-grn', require('./routes/packingGRNRoutes'));
app.use('/api/packing-issue-notes', require('./routes/packingIssueNoteRoutes'));
app.use('/api/fg-transactions', require('./routes/fgTransactionRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
