const mongoose = require('mongoose');

// Tạo schema cho Task
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Chưa hoàn thành', 'Đang tiến hành', 'Hoàn thành'],
        default: 'Chưa hoàn thành'
    },
    // category: {
    //     type: String,
    //     enum: ['Công việc cá nhân', 'Công việc học tập', 'Công việc công ty'],
    //     required: true
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // Liên kết với Category
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Tạo model từ schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
