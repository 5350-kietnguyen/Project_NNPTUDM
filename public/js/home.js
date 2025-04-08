// Chuyển dark/light mode
const toggleBtn = document.getElementById('themeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleBtn.textContent = document.body.classList.contains('dark') ? '🌞' : '🌙';
});

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
  // Xóa thông tin phiên làm việc nếu cần
  // localStorage.removeItem('token'); // nếu bạn dùng token
  
  // Chuyển hướng về trang login
  window.location.href = 'login.html';
});

function updateBigClock() {
    const now = new Date();
    document.getElementById("big-clock").textContent = now.toLocaleTimeString("vi-VN");
    document.getElementById("big-date").textContent = now.toLocaleDateString("vi-VN", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  setInterval(updateBigClock, 1000);
  updateBigClock();
  
  function renderCalendar() {
    const now = new Date();
    const today = now.getDate();
    const year = now.getFullYear();
    const month = now.getMonth();
  
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
  
    const calendarGrid = document.getElementById("calendar-grid");
    const calendarDate = document.getElementById("calendar-date");
  
    const weekdays = ['H', 'B', 'T', 'N', 'S', 'B', 'C']; // HN: Thứ 2 -> Chủ nhật
  
    calendarGrid.innerHTML = "";
    calendarDate.textContent = now.toLocaleDateString("vi-VN", {
      weekday: 'long', day: '2-digit', month: 'long'
    });
  
    // Thêm tiêu đề ngày trong tuần
    weekdays.forEach(day => {
      const div = document.createElement('div');
      div.style.fontWeight = "bold";
      div.textContent = day;
      calendarGrid.appendChild(div);
    });
  
    // Thêm ô trống trước ngày đầu tiên
    const startDay = (firstDay === 0) ? 6 : firstDay - 1; // điều chỉnh CN = 6
    for (let i = 0; i < startDay; i++) {
      const div = document.createElement('div');
      div.innerHTML = "&nbsp;";
      calendarGrid.appendChild(div);
    }
  
    for (let d = 1; d <= lastDate; d++) {
      const div = document.createElement('div');
      div.textContent = d;
      if (d === today) div.classList.add("today");
      calendarGrid.appendChild(div);
    }
  }
  renderCalendar();
  
