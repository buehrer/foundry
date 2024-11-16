const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

console.log('Starting server...');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

const app = express();
console.log('Express app created');

// Middleware
app.use(cors());
app.use(express.json());
console.log('Middleware configured');

// Basic test route
app.get('/', (req, res) => {
  console.log('Received request to /');
  res.json({ message: 'Server is running' });
});

// Chat routes will go here
app.post('/chat', async (req, res) => {
  console.log('Received chat request with', req.body.messages?.length, 'messages');
  
  try {
    const llmService = require('./services/llmService');
    const response = await llmService.generateResponse(
      req.body.messages || [], 
      req.body.settings
    );
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: true,
      message: error.message,
      details: error.toString()
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
}); 