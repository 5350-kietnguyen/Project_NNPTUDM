const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const auth = require('../middleware/auth');  // Thêm middleware auth

// API để tạo công việc mới - yêu cầu người dùng đăng nhập
router.post('/', auth, createTask);

// API để lấy danh sách tất cả công việc - yêu cầu người dùng đăng nhập
router.get('/', auth, getAllTasks);

// API để lấy thông tin một công việc cụ thể - yêu cầu người dùng đăng nhập
router.get('/:id', auth, getTaskById);

// API để chỉnh sửa một công việc - yêu cầu người dùng đăng nhập
router.put('/:id', auth, updateTask);

// API để xóa một công việc - yêu cầu người dùng đăng nhập
router.delete('/:id', auth, deleteTask);

module.exports = router;
