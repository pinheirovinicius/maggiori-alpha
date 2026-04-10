// Maggiori Alpha - interactions
(() => {
  const menuBtn = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    // close on link click (mobile)
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // reveal on scroll
  const els = [...document.querySelectorAll('.reveal')];
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const delay = e.target.getAttribute('data-reveal-delay');
        if (delay) e.target.style.transitionDelay = `${delay}ms`;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));

  // subtle parallax for hero background
  const bg = document.querySelector('.hero__bg');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (bg && !prefersReduced) {
    window.addEventListener('scroll', () => {
      const y = Math.min(240, window.scrollY);
      bg.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    }, { passive: true });
  }

  // contact form -> open WhatsApp with formatted text
  const form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const nome = (document.getElementById('nome')?.value || '').trim();
      const tel = (document.getElementById('telefone')?.value || '').trim();
      const msg = (document.getElementById('mensagem')?.value || '').trim();

      const parts = [];
      if (nome) parts.push(`Nome: ${nome}`);
      if (tel) parts.push(`Telefone: ${tel}`);
      if (msg) parts.push(`Mensagem: ${msg}`);

      const text = encodeURIComponent(`Olá Marcos! Vim pelo site da Maggiori Alpha.%0A%0A${parts.join('%0A')}`);
      const url = `https://wa.me/5511978453956?text=${text}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // hide/show topbar on scroll + back-to-top button
  const topbar = document.querySelector('.topbar');
  const toTop = document.getElementById('toTop');

  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;

    // Topbar behavior
    if (topbar) {
      const goingDown = y > lastY;
      const nearTop = y < 60;
      if (nearTop) {
        topbar.classList.remove('topbar--hidden');
      } else if (goingDown && y > 120) {
        topbar.classList.add('topbar--hidden');
      } else if (!goingDown) {
        topbar.classList.remove('topbar--hidden');
      }
    }

    // Back to top visibility
    if (toTop) {
      if (y > 520) toTop.classList.add('is-visible');
      else toTop.classList.remove('is-visible');
    }

    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Typewriter (delete + type) for hero keyword
  const tw = document.querySelector('.typewriter');
  if (tw && !prefersReduced) {
    const words = (tw.getAttribute('data-words') || 'segurança,pontualidade,conforto,profissionalismo')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let w = 0;
    let i = 0;
    let deleting = false;

    const typeSpeed = 55;
    const deleteSpeed = 35;
    const holdFull = 1150;

    const tick = () => {
      const word = words[w] || '';
      if (!deleting) {
        i++;
        tw.textContent = word.slice(0, i);
        if (i >= word.length) {
          deleting = true;
          setTimeout(tick, holdFull);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        i--;
        tw.textContent = word.slice(0, Math.max(0, i));
        if (i <= 0) {
          deleting = false;
          w = (w + 1) % words.length;
          setTimeout(tick, 220);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    };

    // start after a short delay (so it feels intentional)
    setTimeout(tick, 650);
  }

})();
