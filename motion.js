/* — Progressive enhancement: enable reveal styles — */
document.documentElement.classList.add("js");

/* — Scroll reveal via IntersectionObserver.
   Runs on page-ready (this script is deferred, so the DOM is parsed);
   the reveal no longer waits on the web font — font-display: optional
   handles the swap. — */
function startReveal() {
  var elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  /* Fallback: if no IntersectionObserver, show everything */
  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add("is-visible");
    }
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  /* Make the first project on the home page visible immediately */
  var firstProject = document.querySelector(".projects > .project.reveal");
  if (firstProject) {
    firstProject.classList.add("is-visible");
  }

  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }

  /* Detect mobile/tablet for color fill */
  var isMobileOrTablet = window.matchMedia("(max-width: 1023px)");

  /* Color fill on mobile/tablet — separate persistent observer */
  if (isMobileOrTablet.matches) {
    var colorObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-centered");
          } else {
            entry.target.classList.remove("is-centered");
          }
        });
      },
      { threshold: 0.5 },
    );

    var projects = document.querySelectorAll(
      ".project:not(.project--coming-soon)",
    );
    for (var i = 0; i < projects.length; i++) {
      colorObserver.observe(projects[i]);
    }
  }
}

startReveal();

(function () {
  var videos = document.querySelectorAll("video[data-loop-when-visible]");
  if (!videos.length || !("IntersectionObserver" in window)) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var visibleVideos = new Set();

  function loadVideo(video) {
    var sources = video.querySelectorAll("source[data-src]");
    if (!sources.length) return;
    sources.forEach(function (source) {
      var requiredWidth = video.getBoundingClientRect().width * (window.devicePixelRatio || 1);
      var saveData = navigator.connection && navigator.connection.saveData;
      var useLarge = source.dataset.srcLarge && requiredWidth > Number(source.dataset.srcWidth) && !saveData;
      source.src = useLarge ? source.dataset.srcLarge : source.dataset.src;
      source.removeAttribute("data-src");
    });
    video.preload = "metadata";
    video.load();
  }

  function updatePlayback(video) {
    if (visibleVideos.has(video) && !document.hidden && !reducedMotion.matches) {
      loadVideo(video);
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
      updatePlayback(entry.target);
    });
  }, { threshold: 0.1 });

  var loadObserver = new IntersectionObserver(function (entries) {
    if (reducedMotion.matches || document.hidden) return;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      loadVideo(entry.target);
      loadObserver.unobserve(entry.target);
    });
  }, { rootMargin: "300px 0px" });

  videos.forEach(function (video) {
    observer.observe(video);
    loadObserver.observe(video);
  });
  document.addEventListener("visibilitychange", function () {
    videos.forEach(updatePlayback);
  });
  reducedMotion.addEventListener("change", function () {
    videos.forEach(updatePlayback);
  });
})();

/* Homepage scroll-to-top action. */
(function () {
  var scrollTop = document.querySelector(".home-scroll-top");
  if (!scrollTop) return;
  scrollTop.addEventListener("click", function () {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
    var homeLink = document.querySelector(".home-mark");
    if (homeLink) homeLink.focus({ preventScroll: true });
  });
})();

/* Tooltip panels can be dismissed without moving focus from their trigger. */
(function () {
  var triggers = document.querySelectorAll(".home-tooltip-wrap, .home-team-wrap");
  triggers.forEach(function (trigger) {
    function reset() {
      trigger.removeAttribute("data-tooltip-dismissed");
    }
    trigger.addEventListener("mouseenter", reset);
    trigger.addEventListener("focusin", reset);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    triggers.forEach(function (trigger) {
      if (trigger.matches(":hover") || trigger.contains(document.activeElement)) {
        trigger.setAttribute("data-tooltip-dismissed", "");
      }
    });
  });
})();

/* Linked news cards support hover, keyboard focus, and tap. */
(function () {
  var wrappers = document.querySelectorAll(".home-news-wrap");
  var active = null;
  var desktop = window.matchMedia("(min-width: 1024px)");

  function position(wrapper) {
    var card = wrapper.querySelector(".home-news-card");
    card.style.removeProperty("--news-offset-x");
    card.style.removeProperty("--news-offset-y");
    if (!desktop.matches) return;
    var triggerRect = wrapper.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var left = Math.max(16, Math.min(triggerRect.left, window.innerWidth - cardRect.width - 16));
    var top = triggerRect.bottom + 8;
    if (top + cardRect.height > window.innerHeight - 16) {
      top = triggerRect.top - cardRect.height - 8;
    }
    top = Math.max(16, Math.min(top, window.innerHeight - cardRect.height - 16));
    card.style.setProperty("--news-offset-x", left - triggerRect.left + "px");
    card.style.setProperty("--news-offset-y", top - triggerRect.top + "px");
  }

  function close(wrapper, restoreFocus) {
    if (!wrapper) return;
    wrapper.removeAttribute("data-news-open");
    wrapper.querySelector(".home-news-trigger").setAttribute("aria-expanded", "false");
    wrapper.querySelector(".home-news-card").inert = true;
    if (active === wrapper) active = null;
    if (restoreFocus) {
      wrapper.setAttribute("data-news-dismissed", "");
      wrapper.querySelector(".home-news-trigger").focus({ preventScroll: true });
    }
  }

  function open(wrapper) {
    if (wrapper.hasAttribute("data-news-dismissed")) return;
    if (active && active !== wrapper) close(active);
    position(wrapper);
    wrapper.setAttribute("data-news-open", "");
    wrapper.querySelector(".home-news-trigger").setAttribute("aria-expanded", "true");
    wrapper.querySelector(".home-news-card").inert = false;
    active = wrapper;
  }

  wrappers.forEach(function (wrapper) {
    var trigger = wrapper.querySelector(".home-news-trigger");
    var timer;
    wrapper.addEventListener("pointerenter", function (event) {
      clearTimeout(timer);
      if (event.pointerType !== "mouse") return;
      wrapper.removeAttribute("data-news-dismissed");
      open(wrapper);
    });
    wrapper.addEventListener("pointerleave", function (event) {
      if (event.pointerType !== "mouse") return;
      wrapper.removeAttribute("data-news-dismissed");
      timer = setTimeout(function () {
        if (!wrapper.contains(document.activeElement)) close(wrapper);
      }, 180);
    });
    wrapper.addEventListener("focusin", function () {
      clearTimeout(timer);
      open(wrapper);
    });
    wrapper.addEventListener("focusout", function () {
      timer = setTimeout(function () {
        if (!wrapper.contains(document.activeElement)) {
          close(wrapper);
          wrapper.removeAttribute("data-news-dismissed");
        }
      }, 0);
    });
    trigger.addEventListener("click", function () {
      wrapper.removeAttribute("data-news-dismissed");
      open(wrapper);
    });
    wrapper.querySelector(".home-news-close").addEventListener("click", function () {
      close(wrapper, true);
    });
  });

  document.addEventListener("pointerdown", function (event) {
    if (active && !active.contains(event.target)) close(active);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && active) {
      var restoreFocus = active.querySelector(".home-news-card").contains(document.activeElement);
      active.setAttribute("data-news-dismissed", "");
      close(active, restoreFocus);
    }
  });
  window.addEventListener("resize", function () {
    if (active) position(active);
  });
  window.addEventListener("scroll", function () {
    if (active) position(active);
  }, { passive: true });
})();

/* — Hero carousel — */
(function () {
  var carousel = document.querySelector(".hero-carousel");
  if (!carousel) return;

  var images = carousel.querySelectorAll("img");
  var dots = carousel.querySelectorAll(".hero-carousel-dot");
  var current = 0;
  var interval = 4000;
  var timer;

  function goTo(index) {
    var outImg = images[current];
    var inImg = images[index];
    dots[current].classList.remove("is-active");
    current = index;
    dots[current].classList.add("is-active");

    outImg.classList.remove("is-active");
    inImg.classList.add("is-active");
  }

  function next() {
    goTo((current + 1) % images.length);
  }

  function startAutoplay() {
    timer = setInterval(next, interval);
  }

  for (var i = 0; i < dots.length; i++) {
    (function (idx) {
      dots[idx].addEventListener("click", function () {
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
  var projects = document.querySelectorAll(
    ".project:not(.project--coming-soon)",
  );
  for (var i = 0; i < projects.length; i++) {
    projects[i].addEventListener("mouseenter", function (e) {
      var rect = this.getBoundingClientRect();
      this.style.setProperty("--x", e.clientX - rect.left + "px");
      this.style.setProperty("--y", e.clientY - rect.top + "px");
    });
  }
})();
