const express = require('express');
const router = express.Router();
const { getCompletions } = require('../controllers/completionsController');

// POST /api/completions
router.post('/completions', getCompletions);

module.exports = router; 