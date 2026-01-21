// db.js
const mongoose = require('mongoose');

// const uri = 'mongodb+srv://admin:admin@cluster0.6cj2rkn.mongodb.net/jobPortal';
const uri = 'mongodb+srv://admin:admin@cluster0.6cj2rkn.mongodb.net/jobPortal?retryWrites=true&w=majority';


mongoose.connect(uri)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
