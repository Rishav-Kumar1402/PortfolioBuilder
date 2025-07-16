const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  portfolioLinks: {
    portfolioWebsite: String,
    linkedin: String,
    github: String,
    leetcode: String,
    hackerrank: String
  },
  workExperience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  projects: [{
    title: String,
    techStack: [String],
    description: String,
    github: String,
    liveDemo: String
  }],
  education: [{
    degree: String,
    institution: String,
    duration: String,
    score: String
  }],
  skills: {
    languages: [String],
    tools: [String]
  },
  certifications: [{
    title: String,
    year: String,
    provider: String,
    certificateLink: String
  }],
  profileImage: { type: String } // Base64 string
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create compound index on email to ensure uniqueness
portfolioSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema); 