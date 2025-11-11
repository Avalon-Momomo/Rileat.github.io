document.addEventListener('DOMContentLoaded', () => {
  // ===== 日期 & 日历 =====
  let selectedDate = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('dateDisplay');
  const selectedDateText = document.getElementById('selectedDateText');
  const calendarModal = document.getElementById('calendarModal');
  const calendarInput = document.getElementById('calendarInput');
  const confirmDateBtn = document.getElementById('confirmDate');
  const closeCalendar = document.getElementById('closeCalendar');

  function updateDateDisplay() {
    const d = new Date(selectedDate);
    dateEl.textContent = d.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    selectedDateText.textContent = selectedDate;
  }

  updateDateDisplay();

  dateEl.addEventListener('click', () => {
    calendarModal.style.display = 'block';
    calendarInput.value = selectedDate;
  });
  closeCalendar.onclick = () => (calendarModal.style.display = 'none');
  confirmDateBtn.onclick = () => {
    selectedDate = calendarInput.value;
    calendarModal.style.display = 'none';
    updateDateDisplay();
    renderTodos();
  };

  // ===== 待办事项 =====
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');

  function renderTodos() {
    const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
    const list = allTodos[selectedDate] || [];
    todoList.innerHTML = '';
    list.forEach((t, i) => {
      const li = document.createElement('li');
      li.textContent = t;
      li.addEventListener('click', () => {
        list.splice(i, 1);
        allTodos[selectedDate] = list;
        localStorage.setItem('todos', JSON.stringify(allTodos));
        renderTodos();
      });
      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
      const list = allTodos[selectedDate] || [];
      list.push(text);
      allTodos[selectedDate] = list;
      localStorage.setItem('todos', JSON.stringify(allTodos));
      todoInput.value = '';
      renderTodos();
    }
  });

  renderTodos();

  // ===== 天气 & 城市 =====
  const locationEl = document.getElementById('locationDisplay');
  const weatherEl = document.getElementById('weatherDisplay');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      // 反查城市
      const locRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`);
      const locData = await locRes.json();
      const city = locData.city || locData.locality || '未知城市';
      locationEl.textContent = `📍 ${city}`;

      // 获取天气
      const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const wData = await wRes.json();
      const w = wData.current_weather;
      const icon = getWeatherIcon(w.weathercode);
      weatherEl.innerHTML = `<img class="weather-icon" src="${icon}" alt=""> ${w.temperature}°C，风速 ${w.windspeed} km/h`;
    }, () => {
      locationEl.textContent = "⚠️ 无法获取位置信息";
      weatherEl.textContent = "无法加载天气";
    });
  }

  function getWeatherIcon(code) {
    if (code < 3) return "https://img.icons8.com/emoji/48/000000/sun-emoji.png";
    if (code < 45) return "https://img.icons8.com/emoji/48/000000/cloud-emoji.png";
    if (code < 70) return "https://img.icons8.com/emoji/48/000000/rain-cloud.png";
    return "https://img.icons8.com/emoji/48/000000/snowflake.png";
  }

  // ===== 今日菜单汇总 =====
  const todayMenuList = document.getElementById('todayMenuList');
  if (todayMenuList) {
    const selectedDishes = JSON.parse(localStorage.getItem('selectedDishes')) || [];
    if (selectedDishes.length === 0) {
      todayMenuList.innerHTML = "<p>还没有点菜喔 🍚</p>";
    } else {
      selectedDishes.forEach(d => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `<img src="${d.image}" alt=""><br>${d.name}`;
        todayMenuList.appendChild(div);
      });
    }
  }
});
