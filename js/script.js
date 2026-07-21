const { createApp, reactive, toRefs, onMounted, computed } = Vue;

function initBgParticles(){
  const canvas = document.getElementById('bgParticles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, dpr, particles = [], rafId = null, running = true;

  function getAccentRGB(){
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
    return raw || '59,130,246';
  }

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const density = window.innerWidth < 700 ? 0.045 : 0.09;
    const count = reduceMotion ? 0 : Math.min(90, Math.round((window.innerWidth * window.innerHeight) / 10000 * density * 10));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.4 + 0.6) * dpr,
    }));
  }

  function tick(){
    if(!running){ rafId = null; return; }
    ctx.clearRect(0, 0, width, height);
    const rgb = getAccentRGB();
    const linkDist = 140 * dpr;

    for(let i = 0; i < particles.length; i++){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > width) p.vx *= -1;
      if(p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},.55)`;
      ctx.fill();

      for(let j = i + 1; j < particles.length; j++){
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < linkDist){
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${rgb},${.12 * (1 - dist / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  resize();
  if(!reduceMotion) rafId = requestAnimationFrame(tick);

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    if(running && !rafId && !reduceMotion) rafId = requestAnimationFrame(tick);
  });
}

async function loadTranslations(){
  try {
    const res = await fetch('translations.json');
    return await res.json();
  } catch (err) {
    console.error('Gagal memuat translations.json:', err);
    return { id: {}, en: {} };
  }
}

loadTranslations().then((translationsData) => {
createApp({
  setup(){
    const state = reactive({
      theme:'dark',
      lang:'id',
      loading:true,
      greetIndex:0,
      greetings:['Halo','Hello','Hola','Bonjour','こんにちは'],
      menuOpen:false,
      activeTab:'projects',
      activeSection:'home',
      bgZone:'hero',
      isHovering:false,
      cursorStyle:{ transform:'translate(-100px,-100px)' },
      toastShow:false,
      toastMsg:'',
      cvHref:'#',
      fullName:'Aslam Rizky Fadillah',
      typedText:'',
      selectedProject:null,
      lightboxImage:null,
      statsCount:{ sem:6, proj:3, stack:10, org:2 },
      form:{ name:'', email:'', message:'' },
      coreSkills:['HTML','CSS','JavaScript','React.js','Python','Java','C#','Laravel','Flutter','Dart'],
      softSkills:['Komunikasi','Kerja Tim','Manajemen Waktu','Problem Solving'],
      experience:[
        { year:'2025', org:'Tazkia University',
          role:{ id:'IT System Analyst Intern', en:'IT System Analyst Intern' },
          desc:{ id:'Merancang alur kerja (workflow) sistem menggunakan flow chart untuk memastikan digitalisasi proses penjaminan mutu berjalan efisien dan sesuai standar akreditasi.',
                 en:'Designed system workflows using flowcharts to ensure the digitalization of the quality-assurance process ran efficiently and met accreditation standards.' } },
        { year:'2024', org:'PMB (Penerimaan Mahasiswa Baru)',
          role:{ id:'Team Member Software Engineering', en:'Team Member, Software Engineering' },
          desc:{ id:'Berkontribusi pada penerimaan mahasiswa baru dengan memberikan bimbingan serta meningkatkan pengalaman orientasi bagi mahasiswa baru.',
                 en:'Contributed to the new-student admissions process by providing guidance and improving the orientation experience for incoming students.' } },
        { year:'2024 — Sekarang', org:'Al Fath Organization',
          role:{ id:'Team Member', en:'Team Member' },
          desc:{ id:'Berpartisipasi aktif dalam manajemen kesekretariatan dan administrasi kegiatan dakwah Islam organisasi.',
                 en:"Actively participated in the organization's secretarial management and administration of Islamic outreach (dakwah) activities." } },
      ],
      projects:[
        {
          title:{ id:'Sistem Inventaris Masjid', en:'Mosque Inventory System' },
          image:'img/proj-masjid.jpg',
          desc:{ id:'Sistem manajemen inventaris berbasis web untuk Masjid Syamsul Ulum guna memfasilitasi pelacakan aset secara digital, lengkap dengan fitur peminjaman & pemantauan stok real-time.',
                 en:'A web-based inventory management system for Masjid Syamsul Ulum that digitizes asset tracking, complete with item borrowing and real-time stock monitoring features.' },
          fullDesc:{ id:'Sistem manajemen inventaris berbasis web yang dibangun untuk Masjid Syamsul Ulum. Aplikasi ini memfasilitasi pelacakan aset masjid secara digital dan terpusat, lengkap dengan fitur pencatatan peminjaman barang, riwayat transaksi, serta pemantauan stok secara real-time agar pengurus masjid dapat mengelola inventaris dengan lebih rapi dan transparan.',
                     en:'A web-based inventory management system built for Masjid Syamsul Ulum. The app digitizes and centralizes asset tracking, complete with item-borrowing records, transaction history, and real-time stock monitoring — helping mosque administrators manage inventory in a more organized and transparent way.' },
          tech:[
            { name:'Laravel', icon:'devicon-laravel-plain colored' },
            { name:'PHP', icon:'devicon-php-plain colored' },
            { name:'Blade', icon:'devicon-laravel-plain colored' },
            { name:'JavaScript', icon:'devicon-javascript-plain colored' },
          ],
        },
        {
          title:{ id:'Aplikasi Keuangan Mobile', en:'Mobile Finance App' },
          image:'img/proj-keuangan.jpg',
          desc:{ id:'Aplikasi seluler lintas platform untuk manajemen keuangan pribadi dengan fitur pelacakan pendapatan, pengeluaran, dan pelaporan transaksi.',
                 en:'A cross-platform mobile app for personal finance management, featuring income and expense tracking along with transaction reports.' },
          fullDesc:{ id:'Aplikasi seluler lintas platform (Android & iOS) untuk membantu pengguna mengelola keuangan pribadi. Dilengkapi fitur pencatatan pendapatan dan pengeluaran, kategori transaksi, serta laporan ringkasan keuangan dalam bentuk grafik agar pengguna lebih mudah memahami arus kas hariannya.',
                     en:'A cross-platform mobile app (Android & iOS) that helps users manage their personal finances. It includes income and expense logging, transaction categories, and visual financial summary reports so users can easily understand their daily cash flow.' },
          tech:[
            { name:'Flutter', icon:'devicon-flutter-plain colored' },
            { name:'Dart', icon:'devicon-dart-plain colored' },
          ],
        },
        {
          title:{ id:'Pasar Barang Bekas', en:'Second-Hand Marketplace' },
          image:'img/proj-pasar.jpg',
          desc:{ id:'Aplikasi pasar berbasis konsol dengan prinsip OOP untuk transaksi jual-beli barang bekas secara terstruktur, termasuk pengelolaan daftar produk.',
                 en:'A console-based marketplace app built with OOP principles for structured buying and selling of second-hand goods, including product-listing management.' },
          fullDesc:{ id:'Aplikasi berbasis konsol yang mensimulasikan pasar jual-beli barang bekas dengan menerapkan prinsip Object-Oriented Programming secara konsisten. Mendukung pengelolaan daftar produk, proses transaksi jual-beli, serta validasi data agar alur bisnis sederhana ini tetap terstruktur dan mudah dikembangkan.',
                     en:'A console-based application that simulates a second-hand marketplace by consistently applying Object-Oriented Programming principles. It supports product-listing management, buy/sell transactions, and data validation to keep this simple business flow structured and easy to extend.' },
          tech:[
            { name:'C#', icon:'devicon-csharp-plain colored' },
            { name:'.NET', icon:'devicon-dot-net-plain' },
          ],
        },
      ],
      techStack:[
        { name:'HTML5', icon:'devicon-html5-plain colored' },
        { name:'CSS3', icon:'devicon-css3-plain colored' },
        { name:'JavaScript', icon:'devicon-javascript-plain colored' },
        { name:'React', icon:'devicon-react-original colored' },
        { name:'Python', icon:'devicon-python-plain colored' },
        { name:'Java', icon:'devicon-java-plain colored' },
        { name:'C#', icon:'devicon-csharp-plain colored' },
        { name:'Laravel', icon:'devicon-laravel-plain colored' },
        { name:'Flutter', icon:'devicon-flutter-plain colored' },
        { name:'Dart', icon:'devicon-dart-plain colored' },
        { name:'Git', icon:'devicon-git-plain colored' },
        { name:'GitHub', icon:'devicon-github-original' },
      ],
      certificates:[
        { title:'Web Development with Laravel', org:'Dicoding Indonesia', year:'2025', image:'img/cert-laravel.jpg' },
        { title:'Flutter & Dart Mobile Development', org:'Google Developer Group', year:'2024', image:'img/cert-flutter.jpg' },
        { title:'Object-Oriented Programming Fundamentals', org:'Telkom University', year:'2024', image:'img/cert-oop.jpg' },
      ],
    });

    const TECH_ROW_SIZE = 6;
    const techRows = computed(()=>{
      const rows = [];
      for(let i = 0; i < state.techStack.length; i += TECH_ROW_SIZE){
        rows.push(state.techStack.slice(i, i + TECH_ROW_SIZE));
      }
      return rows.map((items, idx) => ({
        items,
        dir: idx % 2 === 0 ? 'rtl' : 'ltr',
      }));
    });

    const translations = reactive({
      id: translationsData.id || {},
      en: translationsData.en || {},
    });
    const t = computed(() => {
      const current = translations[state.lang];
      return current && Object.keys(current).length > 0 ? current : translations.id;
    });

    function toggleLang() {
      state.lang = state.lang === 'id' ? 'en' : 'id';
      localStorage.setItem('lang', state.lang);
      startTyping();
    }

    const projectsView = computed(()=> state.projects.map(p => ({
      ...p,
      title: p.title[state.lang],
      desc: p.desc[state.lang],
      fullDesc: p.fullDesc[state.lang],
    })));
    const experienceView = computed(()=> state.experience.map(exp => ({
      ...exp,
      role: exp.role[state.lang],
      desc: exp.desc[state.lang],
    })));

    let typingTimer = null;
    function startTyping(){
      if(typingTimer) clearTimeout(typingTimer);
      if(!t.value || !t.value.hero) return;
      const phrases = [state.fullName, t.value.hero.role];
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      function tick(){
        const current = phrases[phraseIndex];
        if(!deleting){
          charIndex++;
          state.typedText = current.slice(0, charIndex);
          if(charIndex === current.length){
            deleting = true;
            typingTimer = setTimeout(tick, 1500);
            return;
          }
        } else {
          charIndex--;
          state.typedText = current.slice(0, charIndex);
          if(charIndex === 0){
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingTimer = setTimeout(tick, 400);
            return;
          }
        }
        typingTimer = setTimeout(tick, deleting ? 45 : 90);
      }
      tick();
    }

    function toggleTheme(){
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
    }

    function sendMessage(){
      const { name, email, message } = state.form;
      const subject = encodeURIComponent('Pesan dari Portofolio — ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = `mailto:aslamrizky81@gmail.com?subject=${subject}&body=${body}`;
      state.toastMsg = 'Membuka aplikasi email kamu...';
      state.toastShow = true;
      setTimeout(()=> state.toastShow = false, 3200);
      state.form = { name:'', email:'', message:'' };
    }

    function openProject(p){
      state.selectedProject = p;
      document.documentElement.style.overflow = 'hidden';
    }
    function closeProject(){
      state.selectedProject = null;
      if(!state.lightboxImage) document.documentElement.style.overflow = '';
    }
    function openLightbox(img){
      state.lightboxImage = img;
      document.documentElement.style.overflow = 'hidden';
    }
    function closeLightbox(){
      state.lightboxImage = null;
      if(!state.selectedProject) document.documentElement.style.overflow = '';
    }

    onMounted(()=>{
      document.documentElement.setAttribute('data-theme', state.theme);

      const savedLang = localStorage.getItem('lang');
      if (savedLang) state.lang = savedLang;
      startTyping();

      document.documentElement.style.overflow = 'hidden';
      const GREET_INTERVAL = 500;
      let step = 0;
      const greetTimer = setInterval(()=>{
        step++;
        if(step < state.greetings.length){
          state.greetIndex = step;
        } else {
          clearInterval(greetTimer);
          state.loading = false;
          document.documentElement.style.overflow = '';
        }
      }, GREET_INTERVAL);

      window.addEventListener('mousemove', (e)=>{
        state.cursorStyle = { transform:`translate(${e.clientX - 4}px, ${e.clientY - 2}px)` };
      });
      document.querySelectorAll('[data-hover], a, button').forEach(el=>{
        el.addEventListener('mouseenter', ()=> state.isHovering = true);
        el.addEventListener('mouseleave', ()=> state.isHovering = false);
      });

      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold:0.15 });
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(el=> io.observe(el));

      const sectionIds = ['home','about','experience','portfolio','contact'];
      const bgZoneMap = { home:'hero', about:'about', experience:'about', portfolio:'projects', contact:'contact' };
      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);
      const spy = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            state.activeSection = entry.target.id;
            state.bgZone = bgZoneMap[entry.target.id] || 'hero';
          }
        });
      }, { threshold:0, rootMargin:'-45% 0px -50% 0px' });
      sections.forEach(sec => spy.observe(sec));
      initBgParticles();

      window.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape'){
          closeProject();
          closeLightbox();
        }
      });
    });

    return { ...toRefs(state), techRows, t, projectsView, experienceView, toggleLang, toggleTheme, sendMessage, openProject, closeProject, openLightbox, closeLightbox };
  }
}).mount('#app');
});