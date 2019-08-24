(() => {
  Array.from(document.querySelectorAll(".experience-header")).forEach(elem => {
    elem.addEventListener("click", e => {
      const header = e.path.find(elem => elem.className == "experience-header");
      header.children[1].classList.toggle("close");
      header.nextElementSibling.classList.toggle("visible");
    });
  });
})();
