// Hàm để lấy dữ liệu từ API backend và hiển thị lên giao diện
async function fetchTasks() {
    try {
        // Lấy danh sách tasks
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

        // Lấy danh sách categories để thay thế _id bằng name
        const categoryResponse = await fetch('/api/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!categoryResponse.ok) {
            throw new Error('Không thể tải danh sách loại công việc');
        }

        const categories = await categoryResponse.json();
        displayTasks(tasks, categories);  // Truyền categories vào function displayTasks
    } catch (err) {
        console.error(err);
        alert('Đã có lỗi xảy ra khi lấy dữ liệu công việc');
    }
}


// Hàm để hiển thị danh sách công việc lên giao diện
function displayTasks(tasks, categories) {
    const taskListContainer = document.getElementById('task-list');
    taskListContainer.innerHTML = ''; // Làm sạch nội dung trước khi thêm công việc mới

    tasks.forEach(task => {
        // Tìm category dựa trên _id của task
        const category = categories.find(cat => cat._id === task.category);
        const categoryName = category ? category.name : 'Chưa có loại';

        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p><strong>Mô tả:</strong> ${task.description}</p>
            <p><strong>Trạng thái:</strong> ${task.status}</p>
            <p><strong>Loại công việc:</strong> ${categoryName}</p>
            <p><strong>Ngày tạo:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
            <button onclick="openEditModal('${task._id}', '${task.title}', '${task.description}', '${task.status}', '${task.category}')">Chỉnh sửa</button>
            <button onclick="openDeleteModal('${task._id}')">Xóa</button>
        `;
        taskListContainer.appendChild(taskElement);
    });
}


    // Thêm công việc mới (POST)
    async function createTask(taskData) {
        try {
            const categoryId = document.querySelector('#category option:checked').value; // Lấy _id của loại công việc
            taskData.category = categoryId; // Gán _id vào taskData

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

    // Lưu công việc mới
    document.getElementById('create-task-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const taskData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            status: document.getElementById('status').value,
            category: document.getElementById('category').value // Lấy _id của category
        };

        createTask(taskData);
    });

    // Cập nhật công việc (PUT)
    async function editTask(id) {
        // Lấy _id của loại công việc thay vì tên
        const categoryId = document.querySelector('#edit-category option:checked').value;

        const taskData = {
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            status: document.getElementById('edit-status').value,  // Gửi trạng thái đã chọn
            category: categoryId  // Gửi _id của loại công việc
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

    // Hàm lấy danh sách loại công việc từ API và điền vào dropdown
    async function fetchCategories() {
        try {
            const response = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải danh sách loại công việc');
            }

            const categories = await response.json();
            populateCategoryDropdown(categories);
        } catch (err) {
            console.error(err);
            alert('Đã có lỗi xảy ra khi lấy dữ liệu loại công việc');
        }
    }

    // Hàm điền vào dropdown loại công việc
    function populateCategoryDropdown(categories) {
        const categorySelect = document.getElementById('category');
        const editCategorySelect = document.getElementById('edit-category');
        
        categorySelect.innerHTML = '';  // Làm sạch dropdown trước khi thêm các option mới
        editCategorySelect.innerHTML = '';  // Làm sạch dropdown trong modal chỉnh sửa

        // Tạo các option cho mỗi loại công việc
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category._id;  // Giá trị là _id của category
            option.textContent = category.name;  // Hiển thị tên của category
            categorySelect.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = category._id;  // Giá trị là _id của category
            editOption.textContent = category.name;  // Hiển thị tên của category
            editCategorySelect.appendChild(editOption);
        });
    }

    // Gọi hàm fetchCategories khi trang được tải
    window.onload = () => {
        fetchTasks();
        fetchCategories(); // Lấy danh sách loại công việc
        checkAdmin();
    };
