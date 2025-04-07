const apiUrl = 'http://localhost:3000/api/categories'; // API backend của bạn

// Tải danh sách loại công việc
function loadCategories() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const categoryTableBody = document.getElementById('categoryTableBody');
            categoryTableBody.innerHTML = ''; // Xóa nội dung cũ

            data.forEach((category, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${category.name}</td>
                    <td>${category.description || 'Không có mô tả'}</td>
                    <td>
                        <button class="btn btn-sm" style="background:#f39c12; color:white;" onclick="editCategory('${category._id}')">Sửa</button>
                        <button class="btn btn-sm" style="background:#e74c3c; color:white;" onclick="deleteCategory('${category._id}')">Xóa</button>
                    </td>
                `;
                categoryTableBody.appendChild(row);
            });
        });
}

// Thêm loại công việc
document.getElementById('addCategoryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const categoryName = document.getElementById('categoryName').value;
    const categoryDescription = document.getElementById('categoryDescription').value;

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, description: categoryDescription })
    })
    .then(response => response.json())
    .then(data => {
        alert('✅ Loại công việc đã được thêm!');
        closeModal('addCategoryModal');
        loadCategories();
        this.reset(); // Reset form
    });
});

// Cập nhật loại công việc
document.getElementById('editCategoryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const categoryId = document.getElementById('editCategoryId').value;
    const categoryName = document.getElementById('editCategoryName').value;
    const categoryDescription = document.getElementById('editCategoryDescription').value;

    fetch(`${apiUrl}/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, description: categoryDescription })
    })
    .then(response => response.json())
    .then(data => {
        alert('✅ Loại công việc đã được cập nhật!');
        closeModal('editCategoryModal');
        loadCategories();
    });
});

// Mở modal chỉnh sửa
function editCategory(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editCategoryId').value = data._id;
            document.getElementById('editCategoryName').value = data.name;
            document.getElementById('editCategoryDescription').value = data.description || '';
            openModal('editCategoryModal');
        });
}

// Xóa loại công việc
function deleteCategory(id) {
    if (confirm('❗ Bạn có chắc muốn xóa loại công việc này?')) {
        fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert('🗑️ Đã xóa loại công việc!');
                loadCategories();
            });
    }
}

// Hiển thị modal
function openModal(id) {
    document.getElementById(id).classList.add("active");
}

// Ẩn modal
function closeModal(id) {
    document.getElementById(id).classList.remove("active");
}

// Tự động tải khi trang load
window.onload = loadCategories;
