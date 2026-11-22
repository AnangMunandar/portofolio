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
  progress.style.width = (tinggi > 0 ? (scrollY / tinggi) * 100 : 0) + "%";
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
if (salin) {
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
}
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
// Gandakan isi strip teknologi supaya putarannya tanpa putus
const stackTrack = document.getElementById("stackTrack");
if (stackTrack) stackTrack.innerHTML += stackTrack.innerHTML;
// ===== Sertifikat: klik untuk memperbesar =====
(function () {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const tutup = document.getElementById("lbTutup");
  if (!lightbox || !lbImg) return;

  function buka(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function tutupLb() {
    lightbox.hidden = true;
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".sertif-thumb").forEach((tombol) => {
    tombol.addEventListener("click", () => {
      const img = tombol.querySelector("img");
      if (img) buka(img.src, img.alt);
    });
  });

  lightbox.addEventListener("click", (e) => { if (e.target !== lbImg) tutupLb(); });
  tutup.addEventListener("click", tutupLb);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) tutupLb(); });
})();
// ===== Formulir kontak: buka Gmail dengan pesan terisi =====
const formKontak = document.getElementById("formKontak");
if (formKontak) {
  formKontak.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = formKontak.elements.nama.value.trim();
    const email = formKontak.elements.email.value.trim();
    const pesan = formKontak.elements.pesan.value.trim();

    const subjek = encodeURIComponent("Pesan dari " + nama);
    const isi = encodeURIComponent("Nama: " + nama + "\nEmail: " + email + "\n\n" + pesan);

    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=masmunandar11@gmail.com&su=" + subjek + "&body=" + isi,
      "_blank",
      "noopener"
    );
    formKontak.reset();
  });
}
// ===== Slider (dipakai proyek & sertifikat) =====
function buatSlider(idTrack, idPrev, idNext, idDots) {
  const track = document.getElementById(idTrack);
  const prev = document.getElementById(idPrev);
  const next = document.getElementById(idNext);
  const dots = document.getElementById(idDots);
  if (!track || !prev || !next || !dots) return;

  const slides = Array.from(track.children);
  let aktif = 0;

  // jarak antar slide (lebar kartu + gap)
  const langkah = () =>
    slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth || 1;
  // banyaknya posisi geser yang mungkin
  const jumlah = () =>
    Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / langkah()) + 1);

  function bangunTitik() {
    dots.innerHTML = "";
    for (let i = 0; i < jumlah(); i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ke posisi " + (i + 1));
      b.addEventListener("click", () => pergi(i));
      dots.appendChild(b);
    }
  }

  function pergi(i) {
    aktif = Math.max(0, Math.min(jumlah() - 1, i));
    track.scrollTo({ left: aktif * langkah(), behavior: "smooth" });
  }

  function perbarui() {
    const maks = jumlah() - 1;
    const ujung = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    aktif = ujung ? maks : Math.max(0, Math.min(maks, Math.round(track.scrollLeft / langkah())));
    Array.from(dots.children).forEach((d, n) => d.classList.toggle("aktif", n === aktif));
    prev.disabled = aktif === 0;
    next.disabled = aktif >= maks;
  }

  prev.addEventListener("click", () => pergi(aktif - 1));
  next.addEventListener("click", () => pergi(aktif + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(perbarui), { passive: true });
  window.addEventListener("resize", () => {
    bangunTitik();
    perbarui();
  });
  bangunTitik();
  perbarui();
}

buatSlider("proyekTrack", "proyekPrev", "proyekNext", "proyekDots");
buatSlider("sertifTrack", "sertifPrev", "sertifNext", "sertifDots");

// ===== Menu aktif + animasi saat menu diklik =====
(function () {
  const tautan = Array.from(document.querySelectorAll(".nav nav a"));
  const daftar = tautan
    .map((a) => ({ a, bagian: document.querySelector(a.getAttribute("href")) }))
    .filter((x) => x.bagian);

  // Tandai menu sesuai bagian yang sedang tampil di tengah layar
  const pantau = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      daftar.forEach((x) => x.a.classList.toggle("aktif", x.bagian === e.target));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  daftar.forEach((x) => pantau.observe(x.bagian));

  // Saat menu diklik: judul bagian tujuan muncul dengan efek sorot
  daftar.forEach(({ a, bagian }) => {
    a.addEventListener("click", () => {
      const judul = bagian.querySelector("h1, h2");
      if (!judul) return;
      setTimeout(() => {
        judul.classList.remove("sorot");
        void judul.offsetWidth; // mulai ulang animasi
        judul.classList.add("sorot");
      }, 450);
    });
  });
})();

// ===== Menu hamburger (tampilan HP) =====
(function () {
  const header = document.getElementById("nav");
  const tombol = document.getElementById("menuBtn");
  if (!header || !tombol) return;

  function atur(buka) {
    header.classList.toggle("menu-buka", buka);
    tombol.setAttribute("aria-expanded", String(buka));
    tombol.setAttribute("aria-label", buka ? "Tutup menu" : "Buka menu");
  }

  tombol.addEventListener("click", () => atur(!header.classList.contains("menu-buka")));
  header.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => atur(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") atur(false); });
  window.addEventListener("resize", () => { if (innerWidth > 800) atur(false); });
})();

// ===== Efek scroll mewah =====
// Hapus blok ini (sampai akhir file) bila ingin kembali tanpa efek.
(function () {
  const kurangGerak = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (kurangGerak) return;
  const bisaHover = matchMedia("(hover: hover)").matches;

  // Jeda berurutan: dipakai saat elemen pertama kali muncul, lalu dilepas
  function berurutan(daftar, jarak, awal) {
    daftar.forEach((el, i) => {
      el.style.transitionDelay = (awal + i * jarak) + "ms";
      el.addEventListener("transitionend", (e) => {
        if (e.target === el) el.style.transitionDelay = "";
      });
    });
  }

  // Teks hero muncul berurutan
  berurutan(Array.from(document.querySelectorAll(".hero-teks .reveal")).filter((el) => el.tagName !== "H1"), 140, 450);
  // Kartu keahlian muncul berurutan
  berurutan(Array.from(document.querySelectorAll(".grid3 .kartu")), 130, 0);

  // Judul hero: pecah per kata
  const h1 = document.querySelector(".hero h1");
  if (h1) {
    let n = 0;
    const bungkus = (teks) => {
      const wadahKata = document.createDocumentFragment();
      teks.split(/(\s+)/).forEach((t) => {
        if (!t) return;
        if (/^\s+$/.test(t)) { wadahKata.appendChild(document.createTextNode(" ")); return; }
        const luar = document.createElement("span");
        luar.className = "kata";
        const dalam = document.createElement("span");
        dalam.className = "kata-isi";
        dalam.style.transitionDelay = 150 + n++ * 170 + "ms";
        dalam.textContent = t;
        luar.appendChild(dalam);
        wadahKata.appendChild(luar);
      });
      return wadahKata;
    };
    Array.from(h1.childNodes).forEach((node) => {
      if (node.nodeType === 3) node.replaceWith(bungkus(node.textContent));
      else if (node.nodeType === 1) { const t = node.textContent; node.textContent = ""; node.appendChild(bungkus(t)); }
    });
    h1.classList.add("h1-kata");
  }

  // Nomor urut untuk kartu di dalam slider
  document.querySelectorAll(".slider-track").forEach((track) => {
    Array.from(track.children).forEach((kartu, i) => kartu.style.setProperty("--i", Math.min(i, 3)));
  });

  if (!bisaHover) return;

  // Kilau mengikuti kursor di atas kartu
  document.querySelectorAll(".kartu, .proyek, .sertif").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // Cahaya latar hero bergeser pelan (layar besar saja)
  const besar = matchMedia("(min-width: 801px)");
  let tunggu = false;
  window.addEventListener("scroll", () => {
    if (tunggu) return;
    tunggu = true;
    requestAnimationFrame(() => {
      tunggu = false;
      if (!besar.matches) return;
      document.documentElement.style.setProperty("--par", String(Math.min(scrollY, 1400)));
    });
  }, { passive: true });
})();