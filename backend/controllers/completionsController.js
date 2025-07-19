const completionsService = require('../services/completionsService');

const getCompletions = async (req, res) => {
  try {
    console.log("requests0",req)
    const { prompt, model, messages, extraHeaders } = req.body;
    if (!prompt && !messages) {
      return res.status(400).json({
        success: false,
        message: 'Prompt or messages are required.'
      });
    }
    // Call the completions service
    const result = await completionsService.getCompletions({ prompt, model, messages, extraHeaders });
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Completions API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing completions request.'
    });
  }
};

module.exports = {
  getCompletions
}; 