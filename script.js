// Animasi muncul saat scroll
const pengamat = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("tampil"); pengamat.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => pengamat.observe(el));

// Cahaya mengikuti kursor
const glow = document.getElementById("glow");
window.addEventListener("pointermove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// Progress scroll + bayangan navbar
const progress = document.getElementById("progress");
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  const tinggi = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (scrollY / tinggi) * 100 + "%";
  nav.classList.toggle("scrolled", scrollY > 20);
});

// Efek mengetik
const kata = ["REST API dengan Go", "sistem login yang aman", "toko online dari nol", "database yang rapi"];
const el = document.getElementById("typed");
let k = 0, h = 0, hapus = false;
function ketik() {
  const t = kata[k];
  el.textContent = t.slice(0, h);
  if (!hapus && h === t.length) { hapus = true; return setTimeout(ketik, 1600); }
  if (hapus && h === 0) { hapus = false; k = (k + 1) % kata.length; }
  h += hapus ? -1 : 1;
  setTimeout(ketik, hapus ? 35 : 75);
}
ketik();

// Tahun footer
document.getElementById("tahun").textContent = new Date().getFullYear();
// Tombol salin email
const salin = document.getElementById("salin");
salin.addEventListener("click", async () => {
  const email = "masmunandar11@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    salin.textContent = "Tersalin ✓";
  } catch {
    salin.textContent = email;
  }
  setTimeout(() => (salin.textContent = "Salin Email"), 2000);
});