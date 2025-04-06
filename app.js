const express = require('express');
const app = express();
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');  // Thêm dotenv để quản lý biến môi trường
const auth = require('./middleware/auth'); // Middleware auth
const isAdmin = require('./middleware/isAdmin'); // Middleware isAdmin

// Load các biến môi trường từ .env file
dotenv.config();

// In ra giá trị của JWT_SECRET để kiểm tra
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Kết nối tới cơ sở dữ liệu MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('Không thể kết nối tới MongoDB:', err);
    process.exit(1);  // Dừng ứng dụng nếu không thể kết nối MongoDB
  });

// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Để phục vụ các file tĩnh (HTML, CSS, JS) trong thư mục "public"
app.use(express.static('./public')); // Thư mục public chứa các file của bạn

// Routes cho người dùng (Đăng ký và đăng nhập người dùng)
app.use('/api/users', userRoutes);

// Routes cho các công việc (API liên quan đến công việc)
app.use('/api/tasks', taskRoutes);

// Middleware xử lý lỗi 404 (Route không tìm thấy)
app.use((req, res, next) => {
    res.status(404).json({ message: "Không tìm thấy route" });
});

// Middleware xử lý lỗi chung (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
});

// Khởi động server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});