const { createApp, reactive, toRefs, onMounted, computed } = Vue;

createApp({
  setup(){
    const state = reactive({
      theme:'dark',
      menuOpen:false,
      activeTab:'projects',
      activeSection:'home',
      isHovering:false,
      dotStyle:{ transform:'translate(-50%,-50%) translate(-100px,-100px)' },
      ringStyle:{ transform:'translate(-50%,-50%) translate(-100px,-100px)' },
      toastShow:false,
      toastMsg:'',
      cvHref:'#',
      selectedProject:null,
      lightboxImage:null,
      statsCount:{ sem:6, proj:3, stack:10, org:2 },
      form:{ name:'', email:'', message:'' },
      coreSkills:['HTML','CSS','JavaScript','React.js','Python','Java','C#','Laravel','Flutter','Dart'],
      softSkills:['Komunikasi','Kerja Tim','Manajemen Waktu','Problem Solving'],
      experience:[
        { year:'2025', role:'IT System Analyst Intern', org:'Tazkia University', desc:'Merancang alur kerja (workflow) sistem menggunakan flow chart untuk memastikan digitalisasi proses penjaminan mutu berjalan efisien dan sesuai standar akreditasi.' },
        { year:'2024', role:'Team Member Software Engineering', org:'PMB (Penerimaan Mahasiswa Baru)', desc:'Berkontribusi pada penerimaan mahasiswa baru dengan memberikan bimbingan serta meningkatkan pengalaman orientasi bagi mahasiswa baru.' },
        { year:'2024 — Sekarang', role:'Team Member', org:'Al Fath Organization', desc:'Berpartisipasi aktif dalam manajemen kesekretariatan dan administrasi kegiatan dakwah Islam organisasi.' },
      ],
      projects:[
        {
          title:'Sistem Inventaris Masjid',
          image:'img/proj-masjid.jpg',
          desc:'Sistem manajemen inventaris berbasis web untuk Masjid Syamsul Ulum guna memfasilitasi pelacakan aset secara digital, lengkap dengan fitur peminjaman & pemantauan stok real-time.',
          fullDesc:'Sistem manajemen inventaris berbasis web yang dibangun untuk Masjid Syamsul Ulum. Aplikasi ini memfasilitasi pelacakan aset masjid secara digital dan terpusat, lengkap dengan fitur pencatatan peminjaman barang, riwayat transaksi, serta pemantauan stok secara real-time agar pengurus masjid dapat mengelola inventaris dengan lebih rapi dan transparan.',
          tech:[
            { name:'Laravel', icon:'devicon-laravel-plain colored' },
            { name:'PHP', icon:'devicon-php-plain colored' },
            { name:'Blade', icon:'devicon-laravel-plain colored' },
            { name:'JavaScript', icon:'devicon-javascript-plain colored' },
          ],
        },
        {
          title:'Aplikasi Keuangan Mobile',
          image:'img/proj-keuangan.jpg',
          desc:'Aplikasi seluler lintas platform untuk manajemen keuangan pribadi dengan fitur pelacakan pendapatan, pengeluaran, dan pelaporan transaksi.',
          fullDesc:'Aplikasi seluler lintas platform (Android & iOS) untuk membantu pengguna mengelola keuangan pribadi. Dilengkapi fitur pencatatan pendapatan dan pengeluaran, kategori transaksi, serta laporan ringkasan keuangan dalam bentuk grafik agar pengguna lebih mudah memahami arus kas hariannya.',
          tech:[
            { name:'Flutter', icon:'devicon-flutter-plain colored' },
            { name:'Dart', icon:'devicon-dart-plain colored' },
          ],
        },
        {
          title:'Pasar Barang Bekas',
          image:'img/proj-pasar.jpg',
          desc:'Aplikasi pasar berbasis konsol dengan prinsip OOP untuk transaksi jual-beli barang bekas secara terstruktur, termasuk pengelolaan daftar produk.',
          fullDesc:'Aplikasi berbasis konsol yang mensimulasikan pasar jual-beli barang bekas dengan menerapkan prinsip Object-Oriented Programming secara konsisten. Mendukung pengelolaan daftar produk, proses transaksi jual-beli, serta validasi data agar alur bisnis sederhana ini tetap terstruktur dan mudah dikembangkan.',
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

      // custom cursor
      window.addEventListener('mousemove', (e)=>{
        state.dotStyle = { transform:`translate(-50%,-50%) translate(${e.clientX}px, ${e.clientY}px)` };
        state.ringStyle = { transform:`translate(-50%,-50%) translate(${e.clientX}px, ${e.clientY}px)`, ...(state.isHovering ? {} : {}) };
      });
      document.querySelectorAll('[data-hover], a, button').forEach(el=>{
        el.addEventListener('mouseenter', ()=> state.isHovering = true);
        el.addEventListener('mouseleave', ()=> state.isHovering = false);
      });

      // scroll reveal
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold:0.15 });
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(el=> io.observe(el));

      // navbar scrollspy
      const sectionIds = ['home','about','experience','portfolio','contact'];
      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);
      const spy = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            state.activeSection = entry.target.id;
          }
        });
      }, { threshold:0, rootMargin:'-45% 0px -50% 0px' });
      sections.forEach(sec => spy.observe(sec));

      window.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape'){
          closeProject();
          closeLightbox();
        }
      });
    });

    return { ...toRefs(state), techRows, toggleTheme, sendMessage, openProject, closeProject, openLightbox, closeLightbox };
  }
}).mount('#app');
