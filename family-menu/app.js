// ⚠️ 替换为你自己的 Supabase 项目信息
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 加载菜品
async function loadDishes() {
  const { data, error } = await supabase.from('dishes').select('*').order('id', { ascending: false });
  if (error) {
    console.error("加载失败:", error);
    return;
  }
  const list = document.getElementById('dishList');
  list.innerHTML = '';
  data.forEach(dish => {
    const div = document.createElement('div');
    div.className = 'dish';
    div.innerHTML = `
      <div>
        <b>${dish.name}</b> (${dish.category || '无分类'}) - $${dish.price || '-'}
      </div>
      <div>
        <button onclick="vote(${dish.id}, ${dish.votes || 0})">点菜 👍</button>
        <span>${dish.votes || 0}</span>
      </div>
    `;
    list.appendChild(div);
  });
}

// 添加新菜
async function addDish() {
  const name = document.getElementById('dishName').value.trim();
  const category = document.getElementById('dishCategory').value.trim();
  const price = parseFloat(document.getElementById('dishPrice').value);
  if (!name) {
    alert("菜名不能为空");
    return;
  }
  const { error } = await supabase.from('dishes').insert([{ name, category, price }]);
  if (error) alert("添加失败: " + error.message);
  else loadDishes();
}

// 点菜（增加 votes）
async function vote(id, votes) {
  const { error } = await supabase.from('dishes').update({ votes: votes + 1 }).eq('id', id);
  if (error) alert("投票失败: " + error.message);
  else loadDishes();
}

// 初次加载
loadDishes();
