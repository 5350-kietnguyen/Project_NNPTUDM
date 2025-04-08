// Hàm xử lý đăng ký
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Ngừng hành động mặc định của form

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Nếu đăng ký thành công, thông báo và chuyển hướng đến trang login
            alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
            window.location.href = 'login.html';  // Chuyển hướng đến trang login
        } else {
            alert(data.error || 'Đã có lỗi xảy ra khi đăng ký');
        }
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
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