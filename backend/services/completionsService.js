const axios = require('axios');

class CompletionsService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1/chat/completions';
  }


  async getCompletions({ prompt, model = 'deepseek/deepseek-r1:free', messages, extraHeaders = {} }) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }
    try {
      // If messages are not provided, create a default message array from prompt
      const chatMessages = messages || [
        { role: 'user', content: prompt }
      ];
      const response = await axios.post(
        this.baseURL,
        {
          model,
          messages: chatMessages
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...extraHeaders
          },
          timeout: 60000
        }
      );
      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        throw new Error('Invalid response from OpenRouter API');
      }
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw new Error(error.response?.data?.message || error.message || 'OpenRouter API error');
    }
  }
}

module.exports = new CompletionsService(); 