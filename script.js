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
// ===== ID Card gantung =====
(function () {
  const wadah = document.getElementById("wadah");
  const gantung = document.getElementById("gantung");
  const kartu = document.getElementById("idCard");
  if (!wadah || !gantung || !kartu) return;

    // QR code ke Instagram
  const qr = document.getElementById("qr");
  const linkIg = "https://www.instagram.com/anangmnndr";
  if (qr) {
    if (window.QRCode) {
      qr.innerHTML = "";
      new QRCode(qr, {
        text: linkIg,
        width: 110,
        height: 110,
        colorDark: "#0b0b10",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M,
      });
    } else {
      // Cadangan kalau library gagal dimuat
      const img = document.createElement("img");
      img.alt = "QR code Instagram";
      img.src = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=" + encodeURIComponent(linkIg);
      qr.appendChild(img);
    }
  }

  // Fisika ayunan sederhana
  const gerakKurang = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sudut = gerakKurang ? 0 : 14;
  let kecepatan = 0;
  let tarik = false;
  let jalan = false;

  function gambar() { gantung.style.transform = `rotate(${sudut}deg)`; }

  function langkah() {
    if (!tarik) {
      kecepatan += -0.018 * sudut;
      kecepatan *= 0.975;
      sudut += kecepatan;
      if (Math.abs(sudut) < 0.02 && Math.abs(kecepatan) < 0.02) {
        sudut = 0; kecepatan = 0; gambar(); jalan = false; return;
      }
    }
    gambar();
    requestAnimationFrame(langkah);
  }
  function mulai() { if (!jalan) { jalan = true; requestAnimationFrame(langkah); } }

  kartu.addEventListener("pointerdown", (e) => {
    tarik = true;
    kartu.classList.add("tarik");
    kartu.setPointerCapture(e.pointerId);
    mulai();
  });

  kartu.addEventListener("pointermove", (e) => {
    if (!tarik) return;
    const r = wadah.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = Math.max(e.clientY - r.top, 80);
    const deg = -Math.atan2(dx, dy) * 180 / Math.PI;
    const baru = Math.max(-40, Math.min(40, deg));
    kecepatan = (baru - sudut) * 0.5;
    sudut = baru;
  });

  function lepas() { tarik = false; kartu.classList.remove("tarik"); mulai(); }
  kartu.addEventListener("pointerup", lepas);
  kartu.addEventListener("pointercancel", lepas);

  gambar();
  mulai();
})();