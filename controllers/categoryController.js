const Category = require('../models/Category');

// Thêm loại công việc mới
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json({ message: 'Loại công việc đã được tạo', category: newCategory });
    } catch (err) {
        res.status(400).json({ error: 'Lỗi khi tạo loại công việc', message: err.message });
    }
};

// Lấy tất cả loại công việc
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách loại công việc', message: err.message });
    }
};

// Lấy thông tin một loại công việc cụ thể
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Loại công việc không tồn tại' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thông tin loại công việc', message: err.message });
    }
};

// Cập nhật loại công việc
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Loại công việc không tồn tại' });
        }

        res.status(200).json({ message: 'Loại công việc đã được cập nhật', category: updatedCategory });
    } catch (err) {
        res.status(400).json({ error: 'Lỗi khi cập nhật loại công việc', message: err.message });
    }
};

// Xóa loại công việc
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Loại công việc không tồn tại' });
        }
        res.status(200).json({ message: 'Loại công việc đã được xóa' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa loại công việc', message: err.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
