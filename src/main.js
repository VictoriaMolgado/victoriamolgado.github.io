(() => {
  Array.from(document.querySelectorAll(".experience-header")).forEach(elem => {
    elem.addEventListener("click", e => {
      const path = e.path || (e.composedPath && e.composedPath());
      const header = path.find(elem => elem.className == "experience-header");
      header.children[1].classList.toggle("close");
      header.nextElementSibling.classList.toggle("visible");
    });
  });
})();
