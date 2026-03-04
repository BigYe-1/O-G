// main script.js — improved, robust and responsive
// Wrap everything in DOMContentLoaded to avoid null selectors
document.addEventListener('DOMContentLoaded', () => {
  /* ========= Smooth scroll to services (explore button) ========= */
  const exploreBtn = document.getElementById('exploreServices');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const target = document.getElementById('services');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ========= Mobile hamburger menu ========= */
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
      menuToggle.classList.toggle('open');
      // toggle aria-expanded for accessibility
      const expanded = siteNav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded);
    });

    // close nav on link click (mobile)
    siteNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (siteNav.classList.contains('open')) siteNav.classList.remove('open');
      });
    });
  }

  /* ========= Stat circles animation using IntersectionObserver ========= */
  const statCircles = document.querySelectorAll('.stat-circle');
  if (statCircles.length) {
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const value = parseInt(el.getAttribute('data-value')) || 0;
          // simple count-up animation
          let current = 0;
          const duration = 1200; // ms
          const stepTime = Math.max(10, Math.floor(duration / (value || 1)));
          const timer = setInterval(() => {
            current += 1;
            el.textContent = current + (el.dataset.suffix || '');
            if (current >= value) {
              clearInterval(timer);
              el.textContent = (value ? value : el.textContent) + (el.dataset.suffix || '');
            }
          }, stepTime);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.45 });

    statCircles.forEach(c => statObserver.observe(c));
  }

  /* ========= Scroll reveal for sections & cards ========= */
  const revealTargets = document.querySelectorAll('.section, .service-card, .testimonial-card, .cert-item, .why-item');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(t => revealObserver.observe(t));
  }

  /* ========= Contact form basic handler ========= */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple UI feedback; replace with real submission logic as needed
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = 'Sending...';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = original;
          // clear fields
          contactForm.reset();
          alert('Message sent — our team will reach out within 24 hours.');
        }, 900);
      }
    });
  }

  /* ========= Chatbot logic (simple local bot) ========= */
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  function appendChat(text, who = 'bot') {
    if (!chatWindow) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (who === 'user' ? 'user' : 'bot');
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    // keep scroll at bottom
    chatWindow.scrollTop = chatWindow.scrollHeight + 200;
  }

  function botResponse(input) {
    const msg = (input || '').toLowerCase();
    if (!msg) return "Hi — how can I help?";
    if (msg.includes('hello') || msg.includes('hi')) return 'Hello 👋 — How may I assist you today?';
    if (msg.includes('service') || msg.includes('services')) return 'We provide pipeline integrity, HSE services, manpower, logistics, instrumentation and more.';
    if (msg.includes('quote') || msg.includes('price')) return 'Please provide a short description of the project and we will prepare a quotation.';
    if (msg.includes('contact') || msg.includes('email')) return 'You can contact us at company@gmail.com or call +123 456 7890.';
    if (msg.includes('hse') || msg.includes('safety')) return 'Our HSE team offers audits, trainings, and emergency response planning.';
    return "Thanks — could you share more details please?";
  }

  function sendChatMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    appendChat(text, 'user');
    chatInput.value = '';
    // emulate thinking
    setTimeout(() => {
      appendChat(botResponse(text), 'bot');
    }, 600);
  }

  if (chatSend && chatInput) {
    chatSend.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  // Accessibility: press Escape to close mobile nav if open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (siteNav && siteNav.classList.contains('open')) siteNav.classList.remove('open');
    }
  });

  /* ========= tiny performance helper: lazy-load images with loading attr fallback ========= */
  try {
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  } catch (err) { /* ignore in older browsers */ }

});
