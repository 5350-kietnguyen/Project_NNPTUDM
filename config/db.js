const mongoose = require('mongoose');

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/taskmanager');

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Dừng ứng dụng nếu không thể kết nối
  }
};

module.exports = connectDB;

