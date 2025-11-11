// 本文件主要给 add.html 使用（添加菜谱）
const form = document.getElementById('addDishForm');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('dishName').value.trim();
    const mealType = document.getElementById('mealType').value;
    const dishType = document.getElementById('dishType').value;
    const materials = document.getElementById('materials').value.trim();
    const steps = document.getElementById('steps').value.trim();
    const imageInput = document.getElementById('dishImage');

    if (!name) return alert('请输入菜名');

    const reader = new FileReader();
    reader.onload = function () {
      const dishes = JSON.parse(localStorage.getItem('dishes')) || [];
      dishes.push({
        name,
        mealType,
        dishType,
        materials,
        steps,
        image: reader.result
      });
      localStorage.setItem('dishes', JSON.stringify(dishes));
      alert('✅ 菜谱已保存！');
      form.reset();
    };
    if (imageInput.files[0]) {
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      reader.onload();
    }
  });
}
