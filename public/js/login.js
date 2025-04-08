// Hàm xử lý đăng nhập
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Ngừng hành động mặc định của form

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Lưu token vào localStorage hoặc sessionStorage
            localStorage.setItem('token', data.token);

            // Chuyển hướng người dùng đến trang Dashboard sau khi đăng nhập thành công
            window.location.href = '/home.html';  // Bạn có thể thay đổi URL này nếu cần
        } else {
            alert(data.error || 'Đăng nhập thất bại');
        }
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại!');
    }
});

// Dark/Light Mode Toggle
const toggleButton = document.getElementById('toggleMode');
const body = document.body;

// Lưu trạng thái từ localStorage
if (localStorage.getItem('mode') === 'dark') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '☀️ Chế độ sáng';
}

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    toggleButton.textContent = isDark ? '☀️ Chế độ sáng' : '🌙 Chế độ tối';
    localStorage.setItem('mode', isDark ? 'dark' : 'light');
});