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

var coll = document.getElementsByClassName("key-step");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}