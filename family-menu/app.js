const dishes = JSON.parse(localStorage.getItem('dishes')) || [];
const menuContainer = document.getElementById('menuContainer');
const saveMenuBtn = document.getElementById('saveMenuBtn');
let selected = JSON.parse(localStorage.getItem('selectedDishes')) || []; // 直接读取已保存的菜

// 当前筛选条件
let mealFilter = 'all';
let typeFilter = 'all';

// 渲染菜谱列表
function renderMenu() {
  menuContainer.innerHTML = '';

  const filtered = dishes.filter(d => 
    (mealFilter === 'all' || d.mealType === mealFilter) &&
    (typeFilter === 'all' || d.dishType === typeFilter)
  );

  if (filtered.length === 0) {
    menuContainer.innerHTML = '<p>暂无该分类菜品 🍚</p>';
    return;
  }

  filtered.forEach(dish => {
    const item = document.createElement('div');
    item.className = 'dish-item';
    // 已选菜保持高亮
    if (selected.find(x => x.name === dish.name)) item.classList.add('selected');

    item.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p><strong>${dish.name}</strong></p>
      <small>${dish.materials}</small>
      <button class="select-btn">${selected.find(x => x.name === dish.name) ? '✅ 已选' : '点菜'}</button>
    `;

    const btn = item.querySelector('.select-btn');
    btn.addEventListener('click', () => {
      const idx = selected.findIndex(x => x.name === dish.name);
      if (idx === -1) {
        selected.push(dish);
        item.classList.add('selected');
        btn.textContent = '✅ 已选';
      } else {
        selected.splice(idx, 1);
        item.classList.remove('selected');
        btn.textContent = '点菜';
      }
    });

    menuContainer.appendChild(item);
  });
}

// ===== 筛选按钮 =====
document.querySelectorAll('#mealFilter .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#mealFilter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mealFilter = btn.dataset.meal;
    renderMenu(); // 切换分类仍显示已选高亮
  });
});

document.querySelectorAll('#typeFilter .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#typeFilter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    typeFilter = btn.dataset.type;
    renderMenu(); // 切换分类仍显示已选高亮
  });
});

// ===== 保存今日菜单 =====
saveMenuBtn.addEventListener('click', () => {
  if (selected.length === 0) return alert('还没有选择任何菜哦 🍚');
  localStorage.setItem('selectedDishes', JSON.stringify(selected));
  alert('✅ 今日菜单已保存！可在首页查看~');
});

// 初始化页面
renderMenu();
