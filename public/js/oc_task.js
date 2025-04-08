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

// Hàm lấy thống kê theo trạng thái
function getStatusCounts(tasks) {
    const statusCounts = { 'Chưa hoàn thành': 0, 'Đang tiến hành': 0, 'Hoàn thành': 0 };
    tasks.forEach(task => {
        if (task.status in statusCounts) {
            statusCounts[task.status]++;
        }
    });
    return statusCounts;
}

// Hàm vẽ biểu đồ thống kê theo trạng thái
function displayStatusChart(statusCounts) {
    const ctx = document.getElementById('statusChart').getContext('2d');

    if (window.statusChartInstance) {
        window.statusChartInstance.destroy();
    }

    // Tạo gradient màu
    const gradientRed = ctx.createLinearGradient(0, 0, 0, 400);
    gradientRed.addColorStop(0, "#f87171");
    gradientRed.addColorStop(1, "#fca5a5");

    const gradientYellow = ctx.createLinearGradient(0, 0, 0, 400);
    gradientYellow.addColorStop(0, "#fde68a");
    gradientYellow.addColorStop(1, "#facc15");

    const gradientGreen = ctx.createLinearGradient(0, 0, 0, 400);
    gradientGreen.addColorStop(0, "#6ee7b7");
    gradientGreen.addColorStop(1, "#34d399");

    window.statusChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: 'Công Việc Theo Trạng Thái',
                data: Object.values(statusCounts),
                backgroundColor: [gradientRed, gradientYellow, gradientGreen],
                borderRadius: 12,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827',
                    titleColor: '#fff',
                    bodyColor: '#d1d5db',
                    padding: 12,
                    cornerRadius: 8,
                    borderColor: '#4b5563',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 14, weight: 'bold' },
                        color: '#1f2937'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                        stepSize: 1,
                        font: { size: 13 },
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

//light/dark mode
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-theme-btn');
    const prefersDark = localStorage.getItem('theme') === 'dark';

    if (prefersDark) {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
});