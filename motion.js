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

  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
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

/* — JS-driven scroll snapping (replaces CSS scroll-snap) — */
(function () {
  var hero = document.querySelector('.hero');
  var projects = document.querySelectorAll('.project');
  if (!hero || !projects.length) return;

  /* Build snap targets: hero + each project */
  function getTargets() {
    var targets = [hero];
    for (var i = 0; i < projects.length; i++) {
      targets.push(projects[i]);
    }
    return targets;
  }

  /* Where we want each target centered (or top-aligned for hero) */
  function getSnapY(el) {
    var rect = el.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var elTop = rect.top + scrollTop;

    if (el === hero) {
      /* Hero snaps to top */
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

  /* Wheel handler — one gesture = one snap */
  var wheelTimeout = null;
  var accumulated = 0;
  var threshold = 30; /* px of wheel delta to trigger snap */
  var snapped = false;

  function onWheel(e) {
    /* Don't hijack horizontal scroll */
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();

    /* If already snapped during this gesture, ignore further wheel events */
    if (snapped) {
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(function () {
        accumulated = 0;
        snapped = false;
      }, 150);
      return;
    }

    accumulated += e.deltaY;

    /* Reset gesture detection after inactivity */
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(function () {
      accumulated = 0;
      snapped = false;
    }, 150);

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
    accumulated = 0;
    snapped = true;
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
    touchSnapped = true;
    touchStartY = null;
  }, { passive: false });
})();
