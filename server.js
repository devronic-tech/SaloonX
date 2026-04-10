const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');
const createDatabase = require('./scripts/initDb');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Start Server
async function startServer() {
  try {
    // 1. Ensure Database exists
    await createDatabase();

    // 2. Authenticate Sequelize
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // 3. Sync Models
    // In production, use migrations instead of { alter: true }
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // 4. Start Listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
}

startServer();
