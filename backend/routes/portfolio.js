const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// Save portfolio data
router.post('/save-portfolio', async (req, res) => {
  try {
    const { email, ...portfolioData } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Use findOneAndUpdate with upsert to ensure only one document per email
    const portfolio = await Portfolio.findOneAndUpdate(
      { email },
      { 
        $set: {
          ...portfolioData,
          email,
          updatedAt: new Date()
        }
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );

    res.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A portfolio with this email already exists'
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Error saving portfolio data',
      details: error.message
    });
  }
});

// Get portfolio data
router.get('/get-portfolio/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const portfolio = await Portfolio.findOne({ email });
    
    if (!portfolio) {
      return res.status(404).json({ 
        success: false, 
        error: 'Portfolio not found' 
      });
    }

    res.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching portfolio data',
      details: error.message
    });
  }
});

module.exports = router; 