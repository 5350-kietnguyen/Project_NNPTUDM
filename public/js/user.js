document.addEventListener('DOMContentLoaded', () => {
    const createUserBtn = document.getElementById('create-user-btn');
    const createUserModal = document.getElementById('create-user-modal');
    const closeCreateUserModalBtn = document.getElementById('close-create-user-modal-btn');
    const createUserForm = document.getElementById('create-user-form');
    
    const editUserModal = document.getElementById('edit-user-modal');
    const closeEditUserModalBtn = document.getElementById('close-edit-user-modal-btn');
    const editUserForm = document.getElementById('edit-user-form');

    const deleteUserModal = document.getElementById('delete-user-modal');
    const closeDeleteUserModalBtn = document.getElementById('close-delete-user-modal-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    const userListTable = document.getElementById('user-list').getElementsByTagName('tbody')[0];

    // Lấy token từ localStorage (hoặc cookie nếu bạn lưu token ở đó)
    const token = localStorage.getItem('token'); // Hoặc sử dụng cookie, tùy vào cách bạn lưu trữ token

    // Hàm tải danh sách người dùng từ API
    async function loadUserList() {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Gửi token trong header Authorization
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách người dùng');
            }

            const users = await response.json();

            // Xóa tất cả dòng cũ trong bảng
            userListTable.innerHTML = '';

            // Duyệt qua danh sách người dùng và thêm từng dòng vào bảng
            users.forEach(user => {
                const row = userListTable.insertRow();
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="edit-btn" data-user-id="${user._id}">Chỉnh sửa</button>
                        <button class="delete-btn" data-user-id="${user._id}">Xóa</button>
                    </td>
                `;
            });

            // Thêm sự kiện cho nút chỉnh sửa và xóa
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', editUser);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', deleteUser);
            });

        } catch (error) {
            console.error('Lỗi khi tải người dùng:', error);
            alert('Không thể tải danh sách người dùng.');
        }
    }

    // Hàm mở modal chỉnh sửa người dùng
    function editUser(event) {
        const userId = event.target.dataset.userId;
        // Gửi yêu cầu lấy thông tin người dùng
        fetch(`/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(user => {
            // Điền thông tin người dùng vào form chỉnh sửa
            document.getElementById('edit-user-id').value = user._id;
            document.getElementById('edit-username').value = user.username;
            document.getElementById('edit-email').value = user.email;
            document.getElementById('edit-role').value = user.role;
            editUserModal.style.display = 'block'; // Mở modal chỉnh sửa
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            alert('Không thể tải thông tin người dùng.');
        });
    }
    
    // Hàm mở modal xóa người dùng
    function deleteUser(event) {
        const userId = event.target.dataset.userId;
        deleteUserModal.style.display = 'block';
        confirmDeleteBtn.dataset.userId = userId;
    }

    // Mở modal tạo người dùng
    createUserBtn.addEventListener('click', () => {
        createUserModal.style.display = 'block';
    });

    // Đóng modal tạo người dùng
    closeCreateUserModalBtn.addEventListener('click', () => {
        createUserModal.style.display = 'none';
    });

    // Tạo người dùng mới
    createUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(createUserForm);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role')
        };
        
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            alert('Người dùng đã được tạo');
            location.reload();
        } else {
            alert('Có lỗi khi tạo người dùng');
        }
    });

    // Đóng modal chỉnh sửa người dùng
    closeEditUserModalBtn.addEventListener('click', () => {
        editUserModal.style.display = 'none';
    });

    // Cập nhật thông tin người dùng
    editUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = document.getElementById('edit-user-id').value;
        const formData = new FormData(editUserForm);

        const updatedUser = {
            username: formData.get('username'),
            email: formData.get('email'),
            role: formData.get('role')
        };

        const password = formData.get('password');
        if (password) {
            updatedUser.password = password;  // Mã hóa mật khẩu nếu có thay đổi
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                alert('Thông tin người dùng đã được cập nhật');
                location.reload();
            } else {
                const error = await response.json();
                console.error('Cập nhật thất bại:', error);
                alert(`Có lỗi khi cập nhật người dùng: ${error.message}`);
            }
        } catch (err) {
            console.error('Có lỗi khi gửi yêu cầu cập nhật:', err);
            alert('Có lỗi khi cập nhật người dùng');
        }
    });

    // Xóa người dùng
    confirmDeleteBtn.addEventListener('click', async () => {
        const userId = confirmDeleteBtn.dataset.userId;

        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,  // Gửi token trong header Authorization
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Người dùng đã được xóa');
            location.reload();
        } else {
            alert('Có lỗi khi xóa người dùng');
        }
    });

    // Đóng modal xóa người dùng
    closeDeleteUserModalBtn.addEventListener('click', () => {
        deleteUserModal.style.display = 'none';
    });

    // Tải danh sách người dùng khi trang được tải
    loadUserList();
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-theme-btn");
    const body = document.body;

    // Tải chế độ đã lưu (nếu có)
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    toggleBtn.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        // Lưu chế độ vào localStorage
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
});