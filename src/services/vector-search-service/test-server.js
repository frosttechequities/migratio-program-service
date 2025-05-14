/**
 * Test Server
 */

const express = require('express');
const app = express();
const PORT = 3007;

// Set up middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Test Server',
    status: 'ok'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test Server listening on port ${PORT}`);
});
