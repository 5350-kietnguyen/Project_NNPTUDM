const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// API đăng ký người dùng mới
router.post('/register', registerUser);

// API đăng nhập người dùng
router.post('/login', loginUser);

// API lấy tất cả người dùng (Chỉ admin)
router.get('/', auth, isAdmin, getAllUsers);

// API lấy thông tin người dùng theo ID (Chỉ admin hoặc người dùng đó)
router.get('/:id', auth, getUserById);

// API cập nhật thông tin người dùng (Chỉ admin hoặc người dùng đó)
router.put('/:id', auth, updateUser);

// API xóa người dùng theo ID
router.delete('/:id', auth, isAdmin, deleteUser)


module.exports = router;