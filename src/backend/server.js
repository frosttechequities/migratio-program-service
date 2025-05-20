const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const documentRoutes = require('./routes/documentRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const programRoutes = require('./routes/programRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const immigrationDataRoutes = require('./routes/immigrationDataRoutes');
const nlpProxy = require('./api/nlpProxy');

// Create Express app
const app = express();

// Set up middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/immigration', immigrationDataRoutes);
app.use('/api/nlp', nlpProxy);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Any route that doesn't match API routes will serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
