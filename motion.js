/* — Progressive enhancement: enable reveal styles — */
document.documentElement.classList.add('js');

/* — Scroll reveal via IntersectionObserver — */
(function () {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    /* Fallback: show everything immediately */
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
