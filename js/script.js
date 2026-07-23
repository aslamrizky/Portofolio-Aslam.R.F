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
    const density = window.innerWidth < 700 ? 0.045 : 0.09; // particles per 1000px^2, tuned for perf
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
    return { id: {}, en: {}, content: {} };
  }
}

loadTranslations().then((translationsData) => {
const content = translationsData.content || {};
createApp({
  setup(){
    const state = reactive({
      theme:'dark',
      lang:'id',
      loading:true,
      greetIndex:0,
      greetings: content.greetings || [],
      menuOpen:false,
      activeTab:'projects',
      activeSection:'home',
      bgZone:'hero',
      isHovering:false,
      cursorStyle:{ transform:'translate(-100px,-100px)' },
      toastShow:false,
      toastMsg:'',
      cvHref:'#',
      fullName: content.fullName || '',
      typedText:'',
      selectedProject:null,
      lightboxImage:null,
      statsCount: content.stats || { sem:0, proj:0, stack:0, org:0 },
      form:{ name:'', email:'', message:'' },
      coreSkills: content.coreSkills || [],
      softSkills: (content.softSkills && content.softSkills.id) || [],
      experience: content.experience || [],
      projects: content.projects || [],
      techStack: content.techStack || [],
      certificates: content.certificates || [],
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
      const sk = content.softSkills || {};
      state.softSkills = sk[state.lang] || sk.id || [];
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
      const mailto = content.mailto || {};
      const subjectPrefix = (mailto.subjectPrefix && mailto.subjectPrefix[state.lang]) || '';
      const toastMsg = (mailto.toast && mailto.toast[state.lang]) || '';
      const subject = encodeURIComponent(subjectPrefix + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = `mailto:${mailto.to || ''}?subject=${subject}&body=${body}`;
      state.toastMsg = toastMsg;
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

      // translations sudah tersedia sebelum app di-mount, tinggal terapkan bahasa tersimpan
      const savedLang = localStorage.getItem('lang');
      if (savedLang) state.lang = savedLang;
      const sk = content.softSkills || {};
      state.softSkills = sk[state.lang] || sk.id || [];
      startTyping();

      // loading screen
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

      // custom cursor — arrow tip aligns with the actual pointer position
      window.addEventListener('mousemove', (e)=>{
        state.cursorStyle = { transform:`translate(${e.clientX - 4}px, ${e.clientY - 2}px)` };
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

      // navbar scrollspy + background zone mapping
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

      // background particle canvas — lightweight, capped for perf, pauses when tab hidden
      initBgParticles();

      // close drawer
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