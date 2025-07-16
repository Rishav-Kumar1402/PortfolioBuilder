const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user's portfolio data
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      status: 'success',
      data: user.portfolioData
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update portfolio data
router.put('/', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { portfolioData: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: updatedUser.portfolioData
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete portfolio data
router.delete('/', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        portfolioData: {
          personalInfo: {},
          experience: [],
          education: [],
          skills: []
        }
      },
      { new: true }
    );

    res.json({
      status: 'success',
      message: 'Portfolio data deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;