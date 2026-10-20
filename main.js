(() => {
  const doc = document.documentElement;
  doc.classList.replace('no-js', 'js');

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const mobile = window.matchMedia('(max-width: 960px)');
  const T = doc.lang.startsWith('zh')
    ? { open: '開啟選單', close: '關閉選單' }
    : { open: 'Open menu', close: 'Close menu' };

  /* ---------- Header: hairline once scrolled, and where the mobile sheet starts ---------- */
  const header = $('[data-header]');
  const setHeaderVars = () => doc.style.setProperty('--nav-top', `${header.getBoundingClientRect().bottom}px`);
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    setHeaderVars();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHeaderVars);
  onScroll();

  /* ---------- Mobile nav ---------- */
  const burger = $('[data-burger]');
  const nav = $('[data-nav]');
  const setNav = (open) => {
    setHeaderVars();
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? T.close : T.open);
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  mobile.addEventListener('change', () => setNav(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); burger.focus(); }
  });

  /* ---------- Gallery lightbox ---------- */
  const lightbox = $('[data-lightbox]');
  if (lightbox) {
    const shots = $$('[data-gallery] button');
    const img = $('[data-lb-img]', lightbox);
    const cap = $('[data-lb-cap]', lightbox);
    let current = 0;

    const show = (i) => {
      current = (i + shots.length) % shots.length;
      const thumb = $('img', shots[current]);
      img.src = shots[current].dataset.full;
      img.alt = thumb.alt;
      cap.textContent = `${thumb.alt} · ${current + 1} / ${shots.length}`;
    };

    shots.forEach((b, i) => b.addEventListener('click', () => {
      show(i);
      lightbox.showModal();
      document.body.classList.add('is-locked');
    }));
    lightbox.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      shots[current].focus();
    });
    $('[data-lb-close]', lightbox).addEventListener('click', () => lightbox.close());
    $('[data-lb-prev]', lightbox).addEventListener('click', () => show(current - 1));
    $('[data-lb-next]', lightbox).addEventListener('click', () => show(current + 1));
    // click on the dimmed backdrop closes
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Menu: scrollspy index ---------- */
  const sections = $$('.menu-section');
  const indexLinks = $$('[data-menu-index] a');
  if (sections.length && indexLinks.length) {
    const linkFor = (id) => indexLinks.find((a) => a.hash === `#${id}`);
    let activeId = null;
    const setActive = (id) => {
      if (id === activeId) return;
      activeId = id;
      indexLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${id}`));
      // keep the active chip in view on the mobile strip
      const a = linkFor(id);
      if (a && mobile.matches) {
        const strip = a.closest('ol');
        strip.scrollTo({ left: a.parentElement.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    // the active section is the last one whose top has passed a third of the way down the screen
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.33;
      const visible = sections.filter((s) => !s.hidden);
      const current = visible.filter((s) => s.getBoundingClientRect().top <= line).pop() || visible[0];
      if (current) setActive(current.id);
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Menu: find a dish ---------- */
  const search = $('[data-menu-search]');
  if (search) {
    const empty = $('[data-no-results]');
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const items = $$('.item').map((el) => ({ el, text: norm(el.textContent) }));

    search.addEventListener('input', () => {
      const q = norm(search.value.trim());
      items.forEach(({ el, text }) => { el.hidden = q !== '' && !text.includes(q); });
      // hide sub-headings and whole sections that end up empty
      $$('.items').forEach((list) => {
        const any = $$('.item:not([hidden])', list).length > 0;
        list.hidden = !any;
        const prev = list.previousElementSibling;
        if (prev?.classList.contains('sub-title')) prev.hidden = !any;
      });
      let shown = 0;
      sections.forEach((s) => {
        const any = $$('.item:not([hidden])', s).length > 0;
        s.hidden = !any;
        if (any) shown++;
      });
      empty.hidden = shown > 0;
    });
  }

  /* ---------- Map (Leaflet, loaded on demand) ---------- */
  const mapEl = $('[data-map]');
  if (mapEl) {
    const lib = mapEl.dataset.lib;
    const loadLeaflet = () => new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${lib}leaflet.css`;
      document.head.append(css);
      const js = document.createElement('script');
      js.src = `${lib}leaflet.js`;
      js.onload = resolve;
      js.onerror = reject;
      document.head.append(js);
    });

    // the "n" from the Nostimo logo
    const MARK = '<svg viewBox="0 0 23.46 19.73" aria-hidden="true"><path fill="currentColor" d="m15.7,16.3V4.8c0-2.36-1.16-3.73-3.17-3.73-.73,0-1.63.17-2.44.56C12.14.21,14.5,0,15.53,0c1.41,0,5.7.43,5.7,5.62v10.98c0,2.32,1.29,2.87,2.23,3.13h-9.65c.81-.26,1.89-.9,1.89-3.43m-12.86.13V4.46C2.83,2.74,1.67,1.24,0,1.07L8.41,0v16.64c0,2.23,1.2,2.83,2.14,3.09H.64c.94-.26,2.19-.9,2.19-3.3"/></svg>';

    const initMap = () => {
      const { L } = window;
      const home = [Number(mapEl.dataset.lat), Number(mapEl.dataset.lng)];
      const station = [Number(mapEl.dataset.stationLat), Number(mapEl.dataset.stationLng)];
      const map = L.map(mapEl, {
        center: home,
        zoom: 17,
        scrollWheelZoom: false,
        // one finger scrolls the page on phones; pinch still zooms
        dragging: !L.Browser.mobile,
        tap: false,
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);

      L.marker(station, {
        icon: L.divIcon({ className: 'map-station', html: `<span class="roundel"></span><span class="station-name">${mapEl.dataset.station}</span>`, iconSize: [14, 14], iconAnchor: [7, 7] }),
        keyboard: false,
        interactive: false,
      }).addTo(map);

      L.marker(home, {
        icon: L.divIcon({ className: 'map-pin', html: `<span class="pin">${MARK}</span><span class="pin-label">Nostimo</span>`, iconSize: [46, 58], iconAnchor: [23, 58] }),
        keyboard: false,
        interactive: false,
      }).addTo(map);

      // keep both the restaurant and the station in view
      map.fitBounds(L.latLngBounds([home, station]).pad(0.9), { maxZoom: 17 });
    };

    const start = () => loadLeaflet().then(initMap).catch(() => mapEl.classList.add('is-failed'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((en) => en.isIntersecting)) { io.disconnect(); start(); }
      }, { rootMargin: '400px 0px' });
      io.observe(mapEl);
    } else {
      start();
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Footer year ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
