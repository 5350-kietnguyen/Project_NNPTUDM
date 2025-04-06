// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ error: 'Không có quyền truy cập' });  // Chỉ admin mới có quyền
    }
    next();  // Cho phép tiếp tục thực hiện hành động (tiến hành các route sau)
};

module.exports = isAdmin;