        // Hàm để lấy dữ liệu từ API backend và hiển thị lên giao diện
        async function fetchTasks() {
            try {
                const response = await fetch('/api/tasks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Không thể tải danh sách công việc');
                }

                const tasks = await response.json();
                displayTasks(tasks);
            } catch (err) {
                console.error(err);
                alert('Đã có lỗi xảy ra khi lấy dữ liệu công việc');
            }
        }

        // Hàm để hiển thị danh sách công việc lên giao diện
        function displayTasks(tasks) {
            const taskListContainer = document.getElementById('task-list');
            taskListContainer.innerHTML = ''; // Làm sạch nội dung trước khi thêm công việc mới

            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.innerHTML = `
                    <h3>${task.title}</h3>
                    <p><strong>Mô tả:</strong> ${task.description}</p>
                    <p><strong>Trạng thái:</strong> ${task.status}</p>
                    <p><strong>Loại công việc:</strong> ${task.category}</p>
                    <p><strong>Ngày tạo:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
                    <button onclick="openEditModal('${task._id}', '${task.title}', '${task.description}', '${task.status}', '${task.category}')">Chỉnh sửa</button>
                    <button onclick="openDeleteModal('${task._id}')">Xóa</button>
                `;
                taskListContainer.appendChild(taskElement);
            });
        }

        // Mở modal tạo công việc
        document.getElementById('create-task-btn').addEventListener('click', () => {
            document.getElementById('create-task-modal').style.display = 'block';
        });

        // Mở modal chỉnh sửa công việc
        function openEditModal(id, title, description, status, category) {
            document.getElementById('edit-title').value = title;
            document.getElementById('edit-description').value = description;
            document.getElementById('edit-status').value = status;
            document.getElementById('edit-category').value = category;
            document.getElementById('edit-task-modal').style.display = 'block';
            document.getElementById('edit-task-form').onsubmit = (e) => {
                e.preventDefault();
                editTask(id);
            };
        }

        // Mở modal xóa công việc
        function openDeleteModal(id) {
            document.getElementById('delete-task-modal').style.display = 'block';
            document.getElementById('confirm-delete-btn').onclick = () => {
                deleteTask(id);
            };
        }

        // Đóng modal tạo công việc
        document.getElementById('close-create-modal-btn').addEventListener('click', () => {
            document.getElementById('create-task-modal').style.display = 'none';
        });

        // Đóng modal chỉnh sửa công việc
        document.getElementById('close-edit-modal-btn').addEventListener('click', () => {
            document.getElementById('edit-task-modal').style.display = 'none';
        });

        // Đóng modal xóa công việc
        document.getElementById('close-delete-modal-btn').addEventListener('click', () => {
            document.getElementById('delete-task-modal').style.display = 'none';
        });

        // Thêm công việc mới (POST)
        async function createTask(taskData) {
            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(taskData)
                });

                if (response.ok) {
                    alert('Công việc đã được tạo thành công');
                    fetchTasks(); // Làm mới danh sách công việc
                    document.getElementById('create-task-modal').style.display = 'none'; // Đóng modal
                } else {
                    alert('Lỗi khi tạo công việc');
                }
            } catch (err) {
                console.error(err);
                alert('Đã có lỗi xảy ra khi tạo công việc');
            }
        }

        // Cập nhật công việc (PUT)
        async function editTask(id) {
            const taskData = {
                title: document.getElementById('edit-title').value,
                description: document.getElementById('edit-description').value,
                status: document.getElementById('edit-status').value,
                category: document.getElementById('edit-category').value
            };

            try {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(taskData)
                });

                if (response.ok) {
                    alert('Công việc đã được cập nhật');
                    fetchTasks(); // Làm mới danh sách công việc
                    document.getElementById('edit-task-modal').style.display = 'none'; // Đóng modal
                } else {
                    alert('Lỗi khi cập nhật công việc');
                }
            } catch (err) {
                console.error(err);
                alert('Đã có lỗi xảy ra khi cập nhật công việc');
            }
        }

        // Xóa công việc (DELETE)
        async function deleteTask(id) {
            const confirmDelete = confirm('Bạn có chắc chắn muốn xóa công việc này?');
            if (!confirmDelete) return;

            try {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    alert('Công việc đã được xóa');
                    fetchTasks(); // Làm mới danh sách công việc
                    document.getElementById('delete-task-modal').style.display = 'none'; // Đóng modal
                } else {
                    alert('Lỗi khi xóa công việc');
                }
            } catch (err) {
                console.error(err);
                alert('Đã có lỗi xảy ra khi xóa công việc');
            }
        }

        // Kiểm tra xem người dùng có phải là admin không
        function checkAdmin() {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded.role === 'admin') {
                    document.getElementById('admin-actions').style.display = 'block'; // Hiển thị các nút admin
                }
            }
        }

        // Gọi hàm kiểm tra admin khi trang được tải
        window.onload = () => {
            fetchTasks();
            checkAdmin();
        };