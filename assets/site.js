// Privacy Pages — shared behavior: scroll reveal, reading progress, TOC highlight, back-to-top
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
        io.observe(el);
      });
    }
  }

  // Reading progress bar
  var bar = document.querySelector('.progress-bar');
  if (bar) {
    var updateBar = function () {
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + '%';
    };
    document.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  // Back-to-top
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var toggleToTop = function () {
      toTop.classList.toggle('visible', window.scrollY > 480);
    };
    document.addEventListener('scroll', toggleToTop, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    toggleToTop();
  }

  // TOC active-section highlight
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length) {
    var sections = Array.prototype.map.call(tocLinks, function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);

    var setActive = function () {
      var pos = window.scrollY + 120;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) current = s;
      });
      tocLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
      });
    };
    document.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }
})();
