/* — Progressive enhancement: enable reveal styles — */
document.documentElement.classList.add("js");

/* — Scroll reveal via IntersectionObserver + anime.js — */
(function () {
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

    var projects = document.querySelectorAll(".project");
    for (var i = 0; i < projects.length; i++) {
      colorObserver.observe(projects[i]);
    }
  }
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

    anime({
      targets: outImg,
      opacity: 0,
      easing: "easeInOutQuad",
      duration: 500,
    });
    anime({
      targets: inImg,
      opacity: 1,
      easing: "easeInOutQuad",
      duration: 500,
    });
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
  var projects = document.querySelectorAll(".project");
  for (var i = 0; i < projects.length; i++) {
    projects[i].addEventListener("mouseenter", function (e) {
      var rect = this.getBoundingClientRect();
      this.style.setProperty("--x", e.clientX - rect.left + "px");
      this.style.setProperty("--y", e.clientY - rect.top + "px");
    });
  }
})();
