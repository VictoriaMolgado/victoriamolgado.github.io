/* — Progressive enhancement: enable reveal styles — */
document.documentElement.classList.add('js');

/* — Scroll reveal via IntersectionObserver — */
(function () {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add('is-visible');
    }
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  /* Make the first project on the home page visible immediately */
  var firstProject = document.querySelector('.projects > .project.reveal');
  if (firstProject) {
    firstProject.classList.add('is-visible');
  }

  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();

/* — Hero carousel — */
(function () {
  var carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  var images = carousel.querySelectorAll('img');
  var dots = carousel.querySelectorAll('.hero-carousel-dot');
  var current = 0;
  var interval = 4000;
  var timer;

  function goTo(index) {
    images[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = index;
    images[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function next() {
    goTo((current + 1) % images.length);
  }

  function startAutoplay() {
    timer = setInterval(next, interval);
  }

  for (var i = 0; i < dots.length; i++) {
    (function (idx) {
      dots[idx].addEventListener('click', function () {
        clearInterval(timer);
        goTo(idx);
        startAutoplay();
      });
    })(i);
  }

  startAutoplay();
})();

/* — Project hover: set radial origin from cursor entry point — */
(function () {
  var projects = document.querySelectorAll('.project');
  for (var i = 0; i < projects.length; i++) {
    projects[i].addEventListener('mouseenter', function (e) {
      var rect = this.getBoundingClientRect();
      this.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      this.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
  }
})();

/* — JS-driven scroll snapping — */
(function () {
  var isHome = !!document.querySelector('.hero');
  var isProject = !!document.querySelector('.project-header');
  if (!isHome && !isProject) return;

  /* Build snap targets depending on page type */
  function getTargets() {
    if (isHome) {
      var hero = document.querySelector('.hero');
      var projects = document.querySelectorAll('.project');
      var targets = [hero];
      for (var i = 0; i < projects.length; i++) {
        targets.push(projects[i]);
      }
      return targets;
    }

    /* Project pages: header, hero images, content sections, images */
    var selectors =
      '.project-header, ' +
      '.project-content > .content-block, ' +
      '.project-content > .project-image-full, ' +
      '.project-content > .project-image-bleed, ' +
      '.project-content > .project-image-pair, ' +
      '.project-content > .image-captioned, ' +
      '.project-content > .project-thanks, ' +
      'body > .project-image-full, ' +
      'body > .project-image-bleed, ' +
      'body > .project-image-pair, ' +
      'body > .image-captioned, ' +
      'body > .hero-carousel';

    return Array.prototype.slice.call(
      document.querySelectorAll(selectors)
    ).sort(function (a, b) {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
  }

  /* Top-aligned elements */
  function isTopAligned(el) {
    return el.classList.contains('hero') || el.classList.contains('project-header');
  }

  /* Where we want each target centered (or top-aligned for header/hero) */
  function getSnapY(el) {
    var rect = el.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var elTop = rect.top + scrollTop;

    if (isTopAligned(el)) {
      return 0;
    }
    /* Center element vertically in viewport */
    var viewportH = window.innerHeight;
    var elH = rect.height;
    return elTop - (viewportH - elH) / 2;
  }

  /* Find current snap index based on scroll position */
  function getCurrentIndex() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var viewportH = window.innerHeight;
    var center = scrollTop + viewportH / 2;
    var targets = getTargets();
    var closest = 0;
    var closestDist = Infinity;

    for (var i = 0; i < targets.length; i++) {
      var rect = targets[i].getBoundingClientRect();
      var elCenter = rect.top + scrollTop + rect.height / 2;
      var dist = Math.abs(center - elCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    return closest;
  }

  /* rAF-based smooth scroll with easing */
  var animating = false;
  var animationId = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function smoothScrollTo(targetY, duration) {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    var startY = window.pageYOffset || document.documentElement.scrollTop;
    var distance = targetY - startY;

    /* Skip if already there */
    if (Math.abs(distance) < 1) {
      animating = false;
      return;
    }

    animating = true;
    var startTime = null;
    var dur = duration || 600;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / dur, 1);
      var eased = easeOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      } else {
        animating = false;
        animationId = null;
      }
    }

    animationId = requestAnimationFrame(step);
  }

  /* Toggle .is-centered on the snapped-to project */
  function setCentered(targets, index) {
    for (var i = 0; i < targets.length; i++) {
      targets[i].classList.remove('is-centered');
    }
    var el = targets[index];
    if (!isTopAligned(el)) {
      el.classList.add('is-centered');
    }
  }

  /* Wheel handler — trackpad-aware snapping */
  var wheelTimeout = null;
  var accumulated = 0;
  var threshold = 30;       /* px of delta to trigger a snap */
  var cooldown = 450;       /* ms to wait after snap before allowing another */
  var snapped = false;
  var lastAbsDelta = 0;     /* track delta magnitude for inertia detection */
  var risingCount = 0;      /* consecutive events with rising magnitude = new gesture */

  function onWheel(e) {
    /* Don't hijack horizontal scroll */
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();

    var absDelta = Math.abs(e.deltaY);

    /* — Inertia detection — */
    if (snapped) {
      /*
       * After a snap, ignore inertial tail events.
       * Inertia = delta magnitudes staying flat or decreasing.
       * A new intentional gesture = multiple consecutive events
       * with *increasing* magnitude.
       */
      if (absDelta > lastAbsDelta + 1) {
        risingCount++;
      } else {
        risingCount = 0;
      }
      lastAbsDelta = absDelta;

      /* Require 3+ rising-magnitude events to confirm new intent */
      if (risingCount < 3) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(function () {
          accumulated = 0;
          snapped = false;
          risingCount = 0;
          lastAbsDelta = 0;
        }, cooldown);
        return;
      }

      /* New gesture confirmed — reset and allow snapping */
      snapped = false;
      accumulated = 0;
      risingCount = 0;
      lastAbsDelta = 0;

      /* Cancel current animation so the new snap takes over */
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        animating = false;
      }
    }

    accumulated += e.deltaY;
    lastAbsDelta = absDelta;

    /* Reset gesture detection after inactivity */
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(function () {
      accumulated = 0;
      snapped = false;
      risingCount = 0;
      lastAbsDelta = 0;
    }, cooldown);

    if (Math.abs(accumulated) < threshold) return;

    var direction = accumulated > 0 ? 1 : -1;
    var targets = getTargets();
    var current = getCurrentIndex();
    var next = Math.max(0, Math.min(targets.length - 1, current + direction));

    /* Snap to next target */
    var targetY = getSnapY(targets[next]);
    /* Clamp to max scroll */
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetY = Math.max(0, Math.min(targetY, maxScroll));

    smoothScrollTo(targetY, 600);
    setCentered(targets, next);
    accumulated = 0;
    snapped = true;
    risingCount = 0;
  }

  window.addEventListener('wheel', onWheel, { passive: false });

  /* Touch handler — swipe up/down = one snap */
  var touchStartY = null;
  var touchThreshold = 40;
  var touchSnapped = false;

  window.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchSnapped = false;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (touchStartY === null || touchSnapped) return;

    var deltaY = touchStartY - e.touches[0].clientY;
    if (Math.abs(deltaY) < touchThreshold) return;

    e.preventDefault();

    var direction = deltaY > 0 ? 1 : -1;
    var targets = getTargets();
    var current = getCurrentIndex();
    var next = Math.max(0, Math.min(targets.length - 1, current + direction));

    var targetY = getSnapY(targets[next]);
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetY = Math.max(0, Math.min(targetY, maxScroll));

    smoothScrollTo(targetY, 600);
    setCentered(targets, next);
    touchSnapped = true;
    touchStartY = null;
  }, { passive: false });
})();
