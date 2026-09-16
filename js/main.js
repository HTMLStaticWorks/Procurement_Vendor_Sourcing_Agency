/**
 * Main Javascript for Nexolve Technologies — Procurement & Vendor Sourcing Agency
 * Includes Procurement Savings Engine logic, interactive tabs, tickers, metric counters, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndRTL();
  initHeader();
  initMobileMenu();
  initSavingsEngine();
  initMetricCounters();
  initTabFilters();
  initToasts();
  initHomeHeroInteractive();
  initSupplierRadarHUD();
  initAboutHeroInteractive();
  initCinematicVideos();
});

/* Sticky Header Scroll Effect */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* Mobile Menu Navigation (Strict 320px-1024px Support) */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close on any link or button click inside the menu
    navLinks.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      }
    });
  }
}

/* THE PROCUREMENT SAVINGS ENGINE (Signature Interactive Feature) */
function initSavingsEngine() {
  const spendSlider = document.getElementById('spendSlider');
  if (!spendSlider) return;

  const currentSpendDisplay = document.getElementById('currentSpendDisplay');
  const currentSpendDisplay2 = document.getElementById('currentSpendDisplay2');
  const supplierCountDisplay = document.getElementById('supplierCountDisplay');
  const quotesCountDisplay = document.getElementById('quotesCountDisplay');
  const optimizedSpendDisplay = document.getElementById('optimizedSpendDisplay');
  const totalSavingsDisplay = document.getElementById('totalSavingsDisplay');
  const savingsPctDisplay = document.getElementById('savingsPctDisplay');

  function updateEngine(val) {
    const spend = parseFloat(val); // in millions
    const spendFormatted = `$${spend.toFixed(2)}M`;
    
    // Formula derived from procurement benchmarking (typically 16% - 24% cost optimization)
    const savingsRatio = 0.1833; // ~18.33% average baseline savings
    const optimizedVal = spend * (1 - savingsRatio);
    const savingsVal = spend * savingsRatio;
    
    // Scaling suppliers & quotes based on spend volume
    const baseSuppliers = Math.max(8, Math.round(spend * 6.5));
    const baseQuotes = Math.round(baseSuppliers * 2);

    if (currentSpendDisplay) currentSpendDisplay.textContent = spendFormatted;
    if (currentSpendDisplay2) currentSpendDisplay2.textContent = spendFormatted;
    if (optimizedSpendDisplay) optimizedSpendDisplay.textContent = `$${optimizedVal.toFixed(2)}M`;
    if (totalSavingsDisplay) totalSavingsDisplay.textContent = `$${(savingsVal * 1000000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (supplierCountDisplay) supplierCountDisplay.textContent = `${baseSuppliers} Qualified Suppliers`;
    if (quotesCountDisplay) quotesCountDisplay.textContent = `${baseQuotes} Competitive Quotes`;
    if (savingsPctDisplay) savingsPctDisplay.textContent = `-${(savingsRatio * 100).toFixed(1)}%`;
  }

  spendSlider.addEventListener('input', (e) => {
    updateEngine(e.target.value);
  });

  // Trigger initial calculation
  updateEngine(spendSlider.value);
}

/* Metric Number Counter Animation */
function initMetricCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseFloat(target.getAttribute('data-target'));
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const decimals = parseInt(target.getAttribute('data-decimals') || '0', 10);
        let current = 0;
        const duration = 1600;
        const stepTime = 20;
        const increment = countTo / (duration / stepTime);

        const timer = setInterval(() => {
          current += increment;
          if (current >= countTo) {
            target.textContent = prefix + countTo.toFixed(decimals) + suffix;
            clearInterval(timer);
          } else {
            target.textContent = prefix + current.toFixed(decimals) + suffix;
          }
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

/* Tab Filtering (For Services, Industries, Case Studies, Sourcing Matrix) */
function initTabFilters() {
  const filterBtns = document.querySelectorAll('[data-filter-tab]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.tab-container') || document;
      const targetGroup = btn.getAttribute('data-filter-group') || 'default';
      const targetCategory = btn.getAttribute('data-filter-tab');

      // Update active state on buttons
      parent.querySelectorAll(`[data-filter-group="${targetGroup}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter target items
      const items = parent.querySelectorAll(`[data-filter-item="${targetGroup}"]`);
      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (targetCategory === 'all' || itemCat === targetCategory) {
          item.style.display = '';
          item.style.opacity = '0';
          setTimeout(() => { item.style.opacity = '1'; }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Toast Alert System */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✓' : 'ℹ';
  toast.innerHTML = `<span style="color:var(--color-copper); font-weight:bold;">${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function initToasts() {
  window.showToast = showToast;
}

/* ==========================================================================
   1. Home Hero Section Interactive Features (index.html)
   ========================================================================== */
function initHomeHeroInteractive() {
  const heroSection = document.querySelector('.home-hero');
  if (!heroSection) return;

  const heroMatrix = heroSection.querySelector('.hero-matrix');
  if (heroMatrix) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroMatrix.style.transform = `translate(calc(-50% + ${x * 24}px), calc(-50% + ${y * 24}px)) rotate(${x * 15}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroMatrix.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    });
  }
}

/* ==========================================================================
   2. Home 2 Hero Section: Interactive Supplier Radar HUD (home-2.html)
   ========================================================================== */
function initSupplierRadarHUD() {
  const hudContainer = document.getElementById('supplierRadarHUD');
  if (!hudContainer) return;

  const sectorData = {
    direct: {
      title: 'Sector: Direct Materials',
      capacity: '94.8% Active',
      capacityPct: 94.8,
      esg: '98.2% A+',
      esgPct: 98.2,
      savings: '-19.4% Avg',
      savingsPct: 82.0,
      spend: '$1.24B Sourced'
    },
    packaging: {
      title: 'Sector: Packaging & Corrugated',
      capacity: '96.5% Active',
      capacityPct: 96.5,
      esg: '99.1% A+',
      esgPct: 99.1,
      savings: '-22.8% Avg',
      savingsPct: 88.0,
      spend: '$480M Sourced'
    },
    capex: {
      title: 'Sector: Industrial & Capex',
      capacity: '91.2% Active',
      capacityPct: 91.2,
      esg: '96.8% A+',
      esgPct: 96.8,
      savings: '-16.7% Avg',
      savingsPct: 75.0,
      spend: '$890M Sourced'
    },
    pharma: {
      title: 'Sector: Pharma & Medical Cleanroom',
      capacity: '98.4% Active',
      capacityPct: 98.4,
      esg: '99.8% Tier-1',
      esgPct: 99.8,
      savings: '-15.2% Avg',
      savingsPct: 72.0,
      spend: '$620M Sourced'
    }
  };

  const pillButtons = hudContainer.querySelectorAll('.hud-pill');
  const badgeEl = document.getElementById('hudActiveSectorBadge');
  const capValEl = document.getElementById('hudCapacityVal');
  const capBarEl = document.getElementById('hudCapacityBar');
  const esgValEl = document.getElementById('hudEsgVal');
  const esgBarEl = document.getElementById('hudEsgBar');
  const savValEl = document.getElementById('hudSavingsVal');
  const savBarEl = document.getElementById('hudSavingsBar');
  const spendValEl = document.getElementById('hudSpendVal');

  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectorKey = btn.getAttribute('data-sector');
      const data = sectorData[sectorKey];
      if (!data) return;

      pillButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (badgeEl) badgeEl.textContent = data.title;
      if (capValEl) capValEl.textContent = data.capacity;
      if (capBarEl) capBarEl.style.width = `${data.capacityPct}%`;
      if (esgValEl) esgValEl.textContent = data.esg;
      if (esgBarEl) esgBarEl.style.width = `${data.esgPct}%`;
      if (savValEl) savValEl.textContent = data.savings;
      if (savBarEl) savBarEl.style.width = `${data.savingsPct}%`;
      if (spendValEl) spendValEl.textContent = data.spend;

      if (window.showToast) {
        window.showToast(`Switched HUD radar to ${data.title.replace('Sector: ', '')}`, 'success');
      }
    });
  });
}

/* ==========================================================================
   3. About Us Hero Section Interactive Features (about.html)
   ========================================================================== */
function initAboutHeroInteractive() {
  const metricBoxes = document.querySelectorAll('.page-hero-section .metric-box');
  if (!metricBoxes.length) return;

  metricBoxes.forEach(box => {
    box.style.cursor = 'pointer';
    box.addEventListener('mouseenter', () => {
      box.style.transform = 'translateY(-4px)';
      box.style.borderColor = 'var(--color-gold)';
      box.style.boxShadow = 'var(--shadow-gold)';
    });
    box.addEventListener('mouseleave', () => {
      box.style.transform = 'translateY(0)';
      box.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      box.style.boxShadow = 'none';
    });
  });
}

/* ==========================================================================
   4. Cinematic Video Player Interactions (V/ Assets)
   ========================================================================== */
function initCinematicVideos() {
  const videoWraps = document.querySelectorAll('.cinematic-video-wrap');
  if (!videoWraps.length) return;

  videoWraps.forEach(wrap => {
    const video = wrap.querySelector('video');
    const playBtn = wrap.querySelector('.video-play-btn');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        playBtn.innerHTML = '❚❚';
        if (window.showToast) window.showToast('Cinematic footage playing', 'success');
      } else {
        video.pause();
        playBtn.innerHTML = '▶';
        if (window.showToast) window.showToast('Cinematic footage paused', 'info');
      }
    });

    video.addEventListener('play', () => { playBtn.innerHTML = '❚❚'; });
    video.addEventListener('pause', () => { playBtn.innerHTML = '▶'; });
  });
}

/* ==========================================================================
   5. Theme & RTL Toggle Controller (Light/Dark & LTR/RTL with localStorage)
   ========================================================================== */
function initThemeAndRTL() {
  const savedTheme = localStorage.getItem('nexolve_theme') || 'dark';
  const savedDir = localStorage.getItem('nexolve_dir') || 'ltr';

  // Apply Initial Theme
  applyTheme(savedTheme);

  // Apply Initial Direction
  applyDirection(savedDir);

  // Listen to all theme toggle buttons on page
  const themeBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('nexolve_theme', newTheme);
      if (window.showToast) {
        window.showToast(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} Mode`, 'info');
      }
    });
  });

  // Listen to all RTL toggle buttons on page
  const rtlBtns = document.querySelectorAll('#rtlToggleBtn, .rtl-toggle-btn');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('nexolve_dir', newDir);
      if (window.showToast) {
        window.showToast(`Switched layout to ${newDir.toUpperCase()}`, 'info');
      }
    });
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('light-theme');
    }

    // Update all theme toggle icon displays
    document.querySelectorAll('#themeToggleBtn .theme-toggle-icon, .theme-toggle-btn .theme-toggle-icon').forEach(icon => {
      icon.textContent = theme === 'light' ? '☀️' : '🌙';
    });
  }

  function applyDirection(dir) {
    if (dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }

    // Update all RTL toggle labels
    document.querySelectorAll('#rtlToggleBtn .rtl-label, .rtl-toggle-btn .rtl-label').forEach(label => {
      label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }
}

