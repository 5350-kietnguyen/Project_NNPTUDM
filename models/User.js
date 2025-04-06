const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Tạo schema cho User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Đảm bảo mật khẩu ít nhất 6 ký tự
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Vai trò có thể là 'user' hoặc 'admin'
        default: 'user' // Mặc định là user
    }
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Kiểm tra mật khẩu có đủ dài không
    if (this.password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    // Mã hóa mật khẩu trước khi lưu
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Kiểm tra mật khẩu khi người dùng đăng nhập
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Tạo model User từ schema
const User = mongoose.model('User', userSchema);

module.exports = User; 