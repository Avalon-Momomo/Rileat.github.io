const menu = {};

const addForm = document.getElementById('addForm');
const menuContainer = document.getElementById('menuContainer');

addForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('dishName').value.trim();
  const meal = document.getElementById('mealType').value;
  const type = document.getElementById('dishType').value;

  if (!name) return;

  if (!menu[meal]) menu[meal] = {};
  if (!menu[meal][type]) menu[meal][type] = [];

  menu[meal][type].push(name);
  renderMenu();

  addForm.reset();
});

function renderMenu() {
  menuContainer.innerHTML = '';

  for (const meal in menu) {
    const mealDiv = document.createElement('div');
    mealDiv.innerHTML = `<h3>🍱 ${meal}</h3>`;
    for (const type in menu[meal]) {
      const typeDiv = document.createElement('div');
      typeDiv.innerHTML = `<strong>${type}：</strong>`;
      const dishList = document.createElement('div');
      dishList.className = 'dish-list';

      menu[meal][type].forEach(dish => {
        const item = document.createElement('div');
        item.className = 'dish-item';
        item.textContent = dish;
        item.addEventListener('click', () => {
          item.classList.toggle('selected');
        });
        dishList.appendChild(item);
      });

      typeDiv.appendChild(dishList);
      mealDiv.appendChild(typeDiv);
    }
    menuContainer.appendChild(mealDiv);
  }
}
