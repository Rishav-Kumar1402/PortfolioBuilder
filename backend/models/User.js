const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  // portfolioData: {
  //   personalInfo: {
  //     name: String,
  //     title: String,
  //     email: String,
  //     phone: String,
  //     location: String,
  //     summary: String
  //   },
  //   experience: [{
  //     company: String,
  //     position: String,
  //     duration: String,
  //     description: String
  //   }],
  //   education: [{
  //     institution: String,
  //     degree: String,
  //     year: String,
  //     description: String
  //   }],
  //   skills: [String]
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema); 