const jwt = require('jsonwebtoken');

// Middleware xác thực người dùng
const auth = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');  // Lấy token từ header
    if (!token) {
        return res.status(401).json({ error: 'Không có quyền truy cập' });
    }

    try {
        // Kiểm tra token hợp lệ
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Sử dụng JWT_SECRET từ biến môi trường
        req.userId = decoded.userId;  // Lưu userId vào req để sử dụng sau
        req.role = decoded.role;  // Lưu role vào req để kiểm tra phân quyền (admin/user)

        next();  // Cho phép tiếp tục thực hiện các route sau
    } catch (err) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

module.exports = auth;