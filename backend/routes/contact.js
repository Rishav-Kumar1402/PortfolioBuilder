const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // npm install node-fetch@2

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  const access_key = "e7f58569-0e80-4394-ad04-52b53e41b97f";

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ access_key, name, email, message })
    });

    const data = await response.json();
    if (data.success) {
      res.status(200).json({ success: true, message: "Form submitted successfully" });
    } else {
      res.status(400).json({ success: false, message: data.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;