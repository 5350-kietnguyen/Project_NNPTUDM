const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng mới
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email đã tồn tại' });
        }

        const user = new User({ username, email, password, role });
        await user.save();

        const userResponse = { _id: user._id, username: user.username, email: user.email, role: user.role };

        res.status(201).json({ message: 'Đăng ký thành công', user: userResponse });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi đăng ký người dùng', message: err.message });
    }
};

// Đăng nhập người dùng
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi đăng nhập', message: err.message });
    }
};

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng', message: err.message });
    }
};

// Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng', message: err.message });
    }
};

const bcrypt = require('bcryptjs');

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    console.log('Request body:', req.body);  // Thêm log để kiểm tra dữ liệu

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        // Mã hóa mật khẩu nếu có thay đổi
        if (password) {
            user.password = await bcrypt.hash(password, 10);  // Mã hóa mật khẩu
        }

        // Kiểm tra quyền admin để có thể thay đổi vai trò
        if (role && req.role === 'admin') {
            user.role = role;
        }

        await user.save();
        res.status(200).json({ message: 'Cập nhật người dùng thành công', user });
    } catch (err) {
        console.error('Lỗi khi cập nhật người dùng:', err);  // Hiển thị lỗi chi tiết
        res.status(500).json({ error: 'Lỗi khi cập nhật người dùng', message: err.message });
    }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
    const { id } = req.params;  // Nhận ID người dùng từ params

    try {
        // Kiểm tra xem người dùng có phải là admin không
        if (req.role !== 'admin') {
            return res.status(403).json({ error: 'Bạn không có quyền xóa người dùng' });
        }

        // Tìm và xóa người dùng theo ID
        const user = await User.findByIdAndDelete(id);  // Sử dụng findByIdAndDelete thay vì remove

        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        res.status(200).json({ message: 'Người dùng đã được xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa người dùng', message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};