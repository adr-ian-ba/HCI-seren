document.addEventListener("DOMContentLoaded", function(){

    //nav
    const hamburger = document.querySelector('#open-nav');
    const closeIcon = document.querySelector('#close-nav');
    const itemWrapper = document.querySelector('.hidden');
    const overlay = document.querySelector('.middle');
    
    function toggleMenu() {
        if (itemWrapper.style.right === '0px') {
            itemWrapper.style.right = '-100%';
            overlay.style.display = 'none';
        } else {
            itemWrapper.style.right = '0';
            overlay.style.display = 'block';
        }
    }
    
    hamburger.addEventListener('click', toggleMenu);
    closeIcon.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

})