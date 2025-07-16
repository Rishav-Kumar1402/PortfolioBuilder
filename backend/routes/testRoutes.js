const express = require('express');
const router = express.Router();
const deepseekService = require('../services/deepseekService');

// Test endpoint for DeepSeek API
router.post('/test-deepseek', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for testing'
      });
    }

    console.log('Testing DeepSeek API with text:', text.substring(0, 100) + '...');
    
    const result = await deepseekService.parseResumeWithAI(text);
    
    return res.json({
      success: true,
      data: result,
      message: 'DeepSeek API test successful'
    });

  } catch (error) {
    console.error('DeepSeek test error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'DeepSeek API test failed'
    });
  }
});

module.exports = router; 