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

var coll = document.getElementsByClassName("key-step");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

function openFirstPanel(){
  $('.accordion > dt:first-child').next().addClass('active').slideDown();
}

(function($) {
    
  var allPanels = $('.accordion > dd').hide();
  
  openFirstPanel();
    
  $('.accordion > dt > a').click(function() {
      $this = $(this);
      $target =  $this.parent().next();
      
    
      if($target.hasClass('active')){
        $target.removeClass('active').slideUp(); 
      }else{
        allPanels.removeClass('active').slideUp();
        $target.addClass('active').slideDown();
      }
      
    return false;
  });

})(jQuery);