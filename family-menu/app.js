const SUPABASE_URL = 'https://<你的项目ref>.supabase.co';
const SUPABASE_KEY = '<你的anon key>';
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;

// 登录
document.getElementById('login-btn').onclick = async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    alert('登录失败');
    return;
  }

  currentUser = data;
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('menu-container').style.display = 'block';

  loadDishes();
  loadOrders();
};

// 加载菜品
async function loadDishes() {
  const category = document.getElementById('category-filter').value;
  let query = supabase.from('dishes').select('*').order('id', { ascending: true });
  if (category) query = query.eq('category', category);

  const { data } = await query;
  const list = document.getElementById('dish-list');
  const select = document.getElementById('dish-select');

  list.innerHTML = data.map(d => `
    <li>
      ${d.name} <span class="category-label">${d.category}</span> $${d.price}
      <button onclick="deleteDish(${d.id})">删除</button>
    </li>
  `).join('');

  select.innerHTML = data.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
}

// 添加/修改菜品
document.getElementById('add-dish-btn').onclick = async () => {
  const name = document.getElementById('dish-name').value;
  const category = document.getElementById('dish-category').value;
  const price = parseFloat(document.getElementById('dish-price').value);

  await supabase.from('dishes').upsert({ name, category, price });
  loadDishes();
};

// 删除菜品
async function deleteDish(id) {
  if (!confirm('确定删除吗？')) return;
  await supabase.from('dishes').delete().eq('id', id);
  loadDishes();
}

// 加载点菜记录
async function loadOrders() {
  const { data } = await supabase
    .from('orders')
    .select(`*, users(username), dishes(name, category)`)
    .order('created_at', { ascending: false });

  const tbody = document.querySelector('#order-table tbody');
  tbody.innerHTML = data.map(o => `
    <tr>
      <td>${o.users.username}</td>
      <td>${o.dishes.name}</td>
      <td>${o.dishes.category}</td>
      <td>${o.meal}<
