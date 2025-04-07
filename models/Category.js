const mongoose = require('mongoose');

// Tạo schema cho Category
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

// Tạo model từ schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
