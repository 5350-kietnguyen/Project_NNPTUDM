const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// API để tạo loại công việc mới
router.post('/', createCategory);

// API để lấy tất cả loại công việc
router.get('/', getAllCategories);

// API để lấy thông tin loại công việc theo ID
router.get('/:id', getCategoryById);

// API để cập nhật loại công việc
router.put('/:id', updateCategory);

// API để xóa loại công việc
router.delete('/:id', deleteCategory);

module.exports = router;
