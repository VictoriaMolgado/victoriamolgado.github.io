(() => {
    Array.from(document.querySelectorAll('.more-icon')).forEach(elem => {
        elem.addEventListener('click', (e) => {
            e.target.classList.toggle('close');
            e.target.parentNode.nextElementSibling.classList.toggle('visible');
        })
    });
})();
    