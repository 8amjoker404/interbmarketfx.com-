// script.js
window.addEventListener('load', function() {
    var preloader = document.getElementById('preloader');
    
    // Fade out the preloader
    preloader.style.opacity = '0';

    // Remove the preloader from the DOM after the transition
    setTimeout(function() {
        preloader.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }, 500); // Duration should match the CSS transition time
});
