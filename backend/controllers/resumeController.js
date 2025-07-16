const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const deepseekService = require('../services/deepseekService');

const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        success: false,
        message: 'File not found'
      });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const rawText = data.text;

    // Only use DeepSeek for parsing
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key not configured');
    }
    console.log('Parsing resume with DeepSeek AI...');
    const parsedData = await deepseekService.parseResumeWithAI(rawText);
    console.log('AI parsing successful');
    
    // Return only the AI-parsed structured data
    return res.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Error parsing resume:', error);
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) {}
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing resume'
    });
  } finally {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) {}
    }
  }
};

module.exports = {
  parseResume
}; 