<div align="center">

# ⚡ Aslam Rizky Fadillah — Portfolio

### Software Engineering Student & Game-Tech Enthusiast

Membangun antarmuka & sistem dengan presisi seorang developer,
dan rasa ingin tahu seorang gamer terhadap teknologi.

[![Live Demo](https://img.shields.io/badge/🔗_Live-Demo-3D7EFF?style=for-the-badge)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](#)

</div>

---

## 📖 Tentang

Ini adalah situs portofolio pribadi saya — dibangun dari nol menggunakan **HTML, CSS, dan Vue 3 (CDN)** tanpa build tool, sehingga ringan dan mudah di-deploy di mana saja (GitHub Pages, Netlify, Vercel, dsb). Situs ini menampilkan profil, pengalaman, proyek, tumpukan teknologi, hingga sertifikat yang pernah saya raih.

## ✨ Fitur

- 🎨 **Desain modern & futuristik** — tema gelap dengan aksen neon-blue, grid background, dan efek glow
- 🌗 **Dark / Light mode toggle**
- 🖱️ **Custom cursor** interaktif (dot + ring) mengikuti gerakan mouse
- 🧭 **Scrollspy navigation** — navbar otomatis menyorot section yang sedang aktif
- 🪄 **Scroll reveal animation** menggunakan `IntersectionObserver`
- 🗂️ **Tab interaktif** untuk Projects, Tech Stack, dan Sertifikat
- 🔁 **Tech Stack marquee** — baris berjalan otomatis dengan arah berlawanan tiap baris (looping tanpa putus), otomatis menambah baris baru & membalik arah jika tech stack ditambah
- 🖼️ **Drawer detail proyek** & **lightbox sertifikat**
- 📩 **Form kontak** yang langsung membuka aplikasi email (`mailto:`)
- 📱 **Fully responsive** untuk mobile, tablet, dan desktop

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Markup & Styling | HTML5, CSS3 (custom properties / variables) |
| Interaktivitas | [Vue 3](https://vuejs.org/) (Composition API, via CDN — no build step) |
| Ikon | [Devicon](https://devicon.dev/) |
| Font | Orbitron, Sora, JetBrains Mono (Google Fonts) |

## 📁 Struktur Folder

```
portofolio/
├── index.html          # Struktur & seluruh markup halaman
├── css/
│   └── style.css       # Seluruh styling & animasi
├── js/
│   └── script.js       # Logic Vue: state, computed, interaksi
├── img/                # Foto profil, gambar proyek, sertifikat
└── README.md
```

## 🚀 Menjalankan Secara Lokal

Tidak ada proses build — cukup buka langsung atau jalankan local server:

```bash
# Clone repository
git clone https://github.com/aslamrizky/portofolio.git
cd portofolio

# Opsi 1 — buka langsung
open index.html          # macOS
start index.html         # Windows

# Opsi 2 — jalankan local server (disarankan)
npx serve .
# atau
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080` di browser.

## ⚙️ Kustomisasi

Sebagian besar konten (proyek, tech stack, sertifikat, pengalaman) dikelola sebagai data di dalam `js/script.js`, jadi menambah/mengubah konten cukup dengan mengedit array-nya tanpa menyentuh HTML:

```js
techStack: [
  { name: 'HTML5', icon: 'devicon-html5-plain colored' },
  { name: 'CSS3',  icon: 'devicon-css3-plain colored' },
],
```

## 📬 Kontak

- **GitHub:** [github.com/aslamrizky](https://github.com/aslamrizky)
- **Instagram:** [@aslam.rizky04](https://instagram.com/aslam.rizky04)
- **Email:** aslamrizky81@gmail.com

---

<div align="center">
Dibuat oleh <b>Aslam Rizky Fadillah</b>
</div>
