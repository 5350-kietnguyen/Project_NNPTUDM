const Task = require('../models/Task');

// Tạo công việc mới
const createTask = async (req, res) => {
    try {
        const { title, description, status, category } = req.body;
        const userId = req.userId;  // ID người dùng từ JWT token

        const newTask = new Task({
            title,
            description,
            status,
            category,
            userId
        });

        await newTask.save();
        res.status(201).json({ message: 'Công việc đã được tạo thành công', task: newTask });
    } catch (err) {
        res.status(400).json({ error: 'Có lỗi khi tạo công việc', message: err.message });
    }
};

// Lấy tất cả công việc
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách công việc', message: err.message });
    }
};

// Lấy thông tin của một công việc cụ thể
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Công việc không tồn tại' });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thông tin công việc', message: err.message });
    }
};

// Chỉnh sửa công việc
const updateTask = async (req, res) => {
    try {
        const { title, description, status, category } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status, category },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Công việc không tồn tại' });
        }

        res.status(200).json({ message: 'Công việc đã được cập nhật', task: updatedTask });
    } catch (err) {
        res.status(400).json({ error: 'Lỗi khi cập nhật công việc', message: err.message });
    }
};

// Xóa công việc
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Công việc không tồn tại' });
        }
        res.status(200).json({ message: 'Công việc đã được xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa công việc', message: err.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
