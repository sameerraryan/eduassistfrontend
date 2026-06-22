/* ═══════════════════════════════════════════════════════════
   EDUASSIST — main.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────
   1. NAVBAR — scroll effect + mobile toggle
──────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);

  // also show/hide nav-actions on mobile
  const actions = document.querySelector('.nav-actions');
  if (actions) actions.classList.toggle('open', isOpen);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    const actions = document.querySelector('.nav-actions');
    if (actions) actions.classList.remove('open');
  });
});


/* ────────────────────────────────
   2. SCROLL ANIMATIONS (Intersection Observer)
──────────────────────────────── */
const animateEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('in-view'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.12 });

animateEls.forEach(el => observer.observe(el));


/* ────────────────────────────────
   3. STATS COUNTER ANIMATION
──────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const formatStat = (num, target) => {
  if (target >= 1_000_000) return (num / 1_000_000).toFixed(1);   // 2.0 → "2M+"
  if (target >= 1_000)     return Math.round(num / 1_000);         // 50000 → "50"
  if (target === 49)       return (num / 10).toFixed(1);           // 49 → "4.9"
  return Math.round(num);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.nextElementSibling ? el.nextElementSibling.textContent : '';
    let   start  = null;
    const duration = 1800;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = eased * target;
      el.textContent = formatStat(current, target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatStat(target, target);
    };

    requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));


/* ────────────────────────────────
   4. AI TOOLS DEMO — chat simulations
──────────────────────────────── */
const toolData = {
  lesson: {
    title: 'AI Lesson Planner',
    messages: [
      { role: 'user', text: 'Create a 45-min lesson on Photosynthesis for Grade 7.' },
      {
        role: 'ai',
        text: `<strong>📋 Lesson: Photosynthesis</strong><br>
<span style="color:rgba(248,250,252,0.5);font-size:12px">Grade 7 · Science · 45 min</span><br><br>
🎯 <strong>Objectives:</strong> Explain light-to-energy conversion, identify 3 inputs & outputs<br><br>
⚡ <strong>Hook (5 min):</strong> "What if plants couldn't make food?" — think-pair-share<br><br>
📖 <strong>Direct Instruction (15 min):</strong> Annotated diagram + animated video walkthrough<br><br>
🔬 <strong>Activity (20 min):</strong> Leaf chromatography lab — observe pigment separation<br><br>
✅ <strong>Exit Ticket (5 min):</strong> Draw & label the photosynthesis equation`
      },
      { role: 'user', text: 'Add a 5-question quiz for this lesson.' },
      { role: 'typing', text: '' },
    ]
  },

  quiz: {
    title: 'Quiz Maker',
    messages: [
      { role: 'user', text: 'Make a 5-question MCQ quiz on the Water Cycle for Grade 6.' },
      {
        role: 'ai',
        text: `<strong>📝 Water Cycle Quiz — Grade 6</strong><br><br>
<strong>Q1.</strong> Which process converts liquid water to water vapour?<br>
&nbsp;&nbsp;A) Condensation &nbsp; <span style="color:var(--green)">✓ B) Evaporation</span> &nbsp; C) Precipitation<br><br>
<strong>Q2.</strong> Where does most evaporation on Earth occur?<br>
&nbsp;&nbsp;A) Lakes &nbsp; B) Ice caps &nbsp; <span style="color:var(--green)">✓ C) Oceans</span><br><br>
<strong>Q3.</strong> Rain, snow, and hail are all forms of ___?<br>
&nbsp;&nbsp;<span style="color:var(--green)">✓ A) Precipitation</span> &nbsp; B) Transpiration &nbsp; C) Runoff<br><br>
<em style="color:rgba(248,250,252,0.5)">+ 2 more questions generated · Auto-grading enabled</em>`
      },
      { role: 'user', text: 'Export this as a PDF for students.' },
      { role: 'typing', text: '' },
    ]
  },

  tutor: {
    title: 'Student AI Tutor',
    messages: [
      { role: 'user', text: 'Can you explain fractions in a simple way? I keep getting confused.' },
      {
        role: 'ai',
        text: `No worries — fractions are actually super logical once you see them! 🍕<br><br>
Think of a pizza cut into <strong>8 slices</strong>. If you eat <strong>3 slices</strong>, you ate <strong>3/8</strong> of the pizza.<br><br>
— <strong>Bottom number (denominator)</strong> = total slices<br>
— <strong>Top number (numerator)</strong> = slices you took<br><br>
So <strong>1/2</strong> means 1 out of 2 equal parts — exactly half!<br><br>
Want me to try another example, or give you a quick practice question? 😊`
      },
      { role: 'user', text: 'Yes, give me a practice question!' },
      { role: 'typing', text: '' },
    ]
  },

  simplify: {
    title: 'Content Simplifier',
    messages: [
      {
        role: 'user',
        text: 'Simplify this for Grade 5: "Osmosis is the diffusion of water molecules through a semipermeable membrane from a region of lower solute concentration to a region of higher solute concentration."'
      },
      {
        role: 'ai',
        text: `<strong>✨ Simplified — Grade 5 Level</strong><br><br>
Imagine a tea bag in water. The tea slowly moves <em>through the tiny holes</em> in the bag into the water, even though you didn't stir it. That's similar to osmosis!<br><br>
<strong>Simple definition:</strong> Osmosis is when water moves through a thin barrier (like a bag with tiny holes) from where there's <em>lots of clean water</em> to where there's <em>less clean water</em> — until both sides are balanced.<br><br>
🌱 <strong>Real-life example:</strong> Plant roots absorb water from soil this way!<br><br>
<em style="color:rgba(248,250,252,0.5)">Concept map & vocabulary list also generated ↓</em>`
      },
      { role: 'user', text: 'Now translate this to Hindi.' },
      { role: 'typing', text: '' },
    ]
  }
};

let typingTimer = null;

function buildChat(tool) {
  const chatWindow   = document.getElementById('chatWindow');
  const previewTitle = document.getElementById('previewTitle');
  const data         = toolData[tool];

  if (!data || !chatWindow) return;

  previewTitle.textContent = data.title;
  chatWindow.innerHTML     = '';

  // Render messages one by one with stagger
  data.messages.forEach((msg, i) => {
    setTimeout(() => {
      const wrapper = document.createElement('div');
      wrapper.className = 'chat-msg';

      if (msg.role === 'typing') {
        wrapper.innerHTML = `
          <div class="chat-avatar avatar-ai">AI</div>
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>`;
      } else if (msg.role === 'user') {
        wrapper.innerHTML = `
          <div class="chat-avatar avatar-user">T</div>
          <div class="chat-bubble user-bubble">${msg.text}</div>`;
      } else {
        wrapper.innerHTML = `
          <div class="chat-avatar avatar-ai">AI</div>
          <div class="chat-bubble">${msg.text}</div>`;
      }

      chatWindow.appendChild(wrapper);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, i * 400);
  });
}

// Tool switcher
const toolItems = document.querySelectorAll('.tool-item');
toolItems.forEach(item => {
  item.addEventListener('click', () => {
    toolItems.forEach(t => t.classList.remove('active'));
    item.classList.add('active');
    clearTimeout(typingTimer);
    buildChat(item.dataset.tool);
  });
});

// Initial load
buildChat('lesson');


/* ────────────────────────────────
   5. PRICING TOGGLE — monthly / yearly
──────────────────────────────── */
const toggleSwitch  = document.getElementById('toggleSwitch');
const toggleLabels  = document.querySelectorAll('.toggle-label');
const priceAmounts  = document.querySelectorAll('.amount[data-monthly]');

let isYearly = false;

if (toggleSwitch) {
  toggleSwitch.addEventListener('click', () => {
    isYearly = !isYearly;
    toggleSwitch.classList.toggle('on', isYearly);

    toggleLabels.forEach(lbl => {
      lbl.classList.toggle('active', lbl.dataset.period === (isYearly ? 'yearly' : 'monthly'));
    });

    priceAmounts.forEach(el => {
      const target = parseInt(isYearly ? el.dataset.yearly : el.dataset.monthly, 10);
      if (!isNaN(target)) {
        animatePrice(el, target);
      }
    });
  });
}

function animatePrice(el, target) {
  const start     = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
  const duration  = 400;
  let   startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const val = Math.round(start + (target - start) * progress);
    el.textContent = val === 0 ? '0' : val;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}


/* ────────────────────────────────
   6. BACK TO TOP
──────────────────────────────── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ────────────────────────────────
   7. FEATURE CARD — tilt micro-interaction (desktop only)
──────────────────────────────── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ────────────────────────────────
   8. SMOOTH ANCHOR SCROLL (offset for fixed navbar)
──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});


/* ────────────────────────────────
   9. HERO CARDS — parallax on mouse move
──────────────────────────────── */
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const { width, height } = heroSection.getBoundingClientRect();
    const x = (e.clientX / width  - 0.5) * 12;
    const y = (e.clientY / height - 0.5) * 12;

    const cardMain = document.getElementById('cardMain');
    const cardSub1 = document.getElementById('cardSub1');
    const cardSub2 = document.getElementById('cardSub2');

    if (cardMain) cardMain.style.transform  = `translate(${x * 0.6}px, ${y * 0.6}px)`;
    if (cardSub1) cardSub1.style.transform  = `translate(${x * 1.1}px, ${y * 1.1}px) rotate(2deg)`;
    if (cardSub2) cardSub2.style.transform  = `translate(${x * 0.9}px, ${y * 0.9}px) rotate(-2deg)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    ['cardMain','cardSub1','cardSub2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.transform = '';
    });
  });
}
