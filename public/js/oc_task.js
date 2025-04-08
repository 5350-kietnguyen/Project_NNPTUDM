// Mở modal tạo công việc
document.getElementById('create-task-btn').addEventListener('click', () => {
    fetchCategories(); // Load danh sách category trước mỗi lần mở modal
    document.getElementById('create-task-modal').style.display = 'block';
});


// Đóng modal tạo công việc
document.getElementById('close-create-modal-btn').addEventListener('click', () => {
    document.getElementById('create-task-modal').style.display = 'none';
});

// Mở modal chỉnh sửa công việc
function openEditModal(id, title, description, status, categoryId) {
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-status').value = status;  // Điền trạng thái vào dropdown

    // Điền category vào dropdown
    document.getElementById('edit-category').value = categoryId; // Sử dụng _id của category trong modal chỉnh sửa
    
    // Đảm bảo trạng thái được điền đúng vào dropdown
    const statusOptions = document.getElementById('edit-status').options;
    for (let i = 0; i < statusOptions.length; i++) {
        if (statusOptions[i].value === status) {
            statusOptions[i].selected = true;  // Đánh dấu trạng thái đã chọn
            break;
        }
    }

    document.getElementById('edit-task-modal').style.display = 'block';
    document.getElementById('edit-task-form').onsubmit = (e) => {
        e.preventDefault();
        editTask(id);
    };
}

// Đóng modal chỉnh sửa công việc
document.getElementById('close-edit-modal-btn').addEventListener('click', () => {
    document.getElementById('edit-task-modal').style.display = 'none';
});

// Mở modal xóa công việc
function openDeleteModal(id) {
    document.getElementById('delete-task-modal').style.display = 'block';
    document.getElementById('confirm-delete-btn').onclick = () => {
        deleteTask(id);
    };
}

// Đóng modal xóa công việc
document.getElementById('close-delete-modal-btn').addEventListener('click', () => {
    document.getElementById('delete-task-modal').style.display = 'none';
});