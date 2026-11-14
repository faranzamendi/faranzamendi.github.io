/**
 * Portafolio Web Interactivo — Fabrizio Guillermo Aranzamendi Zenteno
 * Lógica nativa en JavaScript (ES6+) sin dependencias externas
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cambio de Tema (Oscuro / Claro)
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('fa_portfolio_theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', savedTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('fa_portfolio_theme', nextTheme);
    });
  }

  // 2. Menú móvil responsivo
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Filtro interactivo de Habilidades (Técnicas, Blandas, Herramientas)
  const skillFilterTabs = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-skill-filter');

      skillFilterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // 4. Filtro interactivo de Trayectoria Profesional
  const expFilterTabs = document.querySelectorAll('[data-exp-filter]');
  const timelineItems = document.querySelectorAll('.timeline-item');

  expFilterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-exp-filter');

      expFilterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      timelineItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-exp-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  // 5. Botón "Copiar mi correo al portapapeles"
  const copyButtons = document.querySelectorAll('.copy-email-trigger');
  const copyFeedback = document.getElementById('copyFeedback');
  const clipboardToast = document.getElementById('clipboardToast');
  let toastTimeout = null;

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback para contextos locales sin HTTPS estricto
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const email = button.getAttribute('data-email') || 'faranzamendi@gmail.com';
      const labelSpan = button.querySelector('.copy-label');
      const originalText = labelSpan ? labelSpan.textContent : 'Copiar mi correo al portapapeles';

      const success = await copyTextToClipboard(email);

      if (success) {
        if (labelSpan) {
          labelSpan.textContent = '¡Correo copiado al portapapeles! ✓';
        }
        if (copyFeedback) {
          copyFeedback.textContent = `✓ Se copió "${email}" al portapapeles correctamente.`;
        }
        if (clipboardToast) {
          clipboardToast.classList.add('show');
          clipboardToast.setAttribute('aria-hidden', 'false');
        }

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          if (labelSpan) {
            labelSpan.textContent = originalText;
          }
          if (clipboardToast) {
            clipboardToast.classList.remove('show');
            clipboardToast.setAttribute('aria-hidden', 'true');
          }
        }, 3200);
      }
    });
  });

  // 6. Resaltado automático de sección activa al hacer scroll
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
});
