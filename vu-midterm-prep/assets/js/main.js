/* ===== Based on Cocoon Template — main.js (MIT, templatedeck.com) ===== */
/* Handles: scroll-expanding photo boxes, photo fade-in, navbar shrink, mobile nav, scroll animations, talking-head guide */

(function () {
  'use strict';

  // Mark JS as available (enables animation hiding via CSS)
  document.documentElement.classList.add('js');

  // ===== Expanding Photo Boxes =====
  // Expands [data-expand] containers from 6xl (1152px) to 100vw as they scroll toward viewport top

  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var containers = Array.prototype.slice.call(document.querySelectorAll('[data-expand]'));
    if (!containers.length) return;

    var targetMaxWidth = 1152; // 6xl

    function update() {
      var scrollY = window.scrollY || window.pageYOffset;
      var vw = window.innerWidth;

      containers.forEach(function (wrap) {
        var box = wrap.querySelector('div');
        var elTop = wrap.offsetTop;
        var startScroll = Math.max(0, elTop - window.innerHeight);
        var endScroll = elTop;
        var range = endScroll - startScroll;

        if (range <= 0) return;

        var progress = Math.min(1, Math.max(0, (scrollY - startScroll) / range));

        wrap.style.maxWidth = (targetMaxWidth + (vw - targetMaxWidth) * progress) + 'px';
        box.style.borderRadius = ((1 - progress) * 16) + 'px';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // ===== Background Photo Fade on Scroll =====

  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var boxes = document.querySelectorAll('[data-fade-bg]');
    if (!boxes.length) return;

    function update() {
      var vh = window.innerHeight;

      boxes.forEach(function (box) {
        var rect = box.getBoundingClientRect();
        var bg = box.firstElementChild;
        if (!bg) return;

        // 0 when the box enters the viewport bottom, 1 when its bottom reaches the viewport bottom
        var progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.bottom - rect.top)));

        // Opacity: 0.1 → 0.75 (cards on top stay readable)
        bg.style.opacity = 0.1 + progress * 0.65;
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // ===== Navbar Shrink on Scroll =====

  (function () {
    var nav = document.getElementById('main-nav');
    var header = document.getElementById('main-header');
    if (!nav || !header) return;

    var scrolled = false;

    function check() {
      var isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        if (scrolled) {
          nav.classList.remove('pt-10', 'pb-0');
          nav.classList.add('py-4');
          header.style.borderBottomColor = 'var(--color-border)';
        } else {
          nav.classList.remove('py-4');
          nav.classList.add('pt-10', 'pb-0');
          header.style.borderBottomColor = 'transparent';
        }
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  })();

  // ===== Mobile Navigation =====

  document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.getElementById('mobile-menu-button');
    var mobileMenu = document.getElementById('mobile-menu');

    if (!menuButton || !mobileMenu) return;

    function setOpen(open) {
      menuButton.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('hidden', !open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
    }

    menuButton.addEventListener('click', function () {
      var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
      if (!isOpen) {
        var firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        menuButton.focus();
      }
    });
  });

  // ===== Scroll Animations =====

  document.addEventListener('DOMContentLoaded', function () {
    var animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length || !('IntersectionObserver' in window)) {
      animatedElements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    try {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      animatedElements.forEach(function (el) { observer.observe(el); });
    } catch (e) {
      animatedElements.forEach(function (el) { el.classList.add('is-visible'); });
    }
  });

  // ===== Talking-head guide: press C to show where the camera circle sits =====

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      document.body.classList.toggle('show-circle');
    }
  });
})();
