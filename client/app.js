const API = "http://localhost:3000";

/* تسجيل */
async function register() {
  let form = new FormData();
  form.append("username", user.value);
  form.append("password", pass.value);
  form.append("avatar", avatar.files[0]);

  await fetch(API + "/register", {
    method: "POST",
    body: form
  });

  alert("تم التسجيل");
}

/* دخول */
async function login() {
  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  auth.classList.add("hidden");
  app.classList.remove("hidden");

  loadTrades();
}

/* نشر */
async function postTrade() {
  let form = new FormData();

  form.append("name", name.value);
  form.append("price", price.value);
  form.append("tiktok", tiktok.value);
  form.append("itemImg", itemImg.files[0]);
  form.append("wantImg", wantImg.files[0]);

  await fetch(API + "/trade", {
    method: "POST",
    body: form
  });

  loadTrades();
}

/* عرض */
async function loadTrades() {
  const res = await fetch(API + "/trades");
  const data = await res.json();

  trades.innerHTML = "";

  data.forEach(t => {
    trades.innerHTML += `
      <div class="card">
        <h3>${t.name}</h3>
        <img src="${API}/uploads/${t.itemImg}">
        <p>المقابل: ${t.price}</p>
        <img src="${API}/uploads/${t.wantImg}">
        <br>
        <a href="${t.tiktok}" target="_blank">تيك توك</a>
      </div>
    `;
  });
}

/* فتح الفورم */
function openForm() {
  form.classList.toggle("hidden");
}
