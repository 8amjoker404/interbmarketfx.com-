 // Select toggle button and body elements
 const toggleButton = document.getElementById('darkModeToggle');
 const body = document.body;
 const siteLogo = document.getElementById('siteLogo');
 const logoText = document.getElementById('logoText');

 // Check for saved user preference on page load
 document.addEventListener('DOMContentLoaded', () => {
     if (localStorage.getItem('darkMode') === 'enabled') {
         body.classList.add('dark-mode');
         showLogoText(); // Show text overlay when dark mode is enabled
     }
 });

 // Toggle dark mode on button click
 toggleButton?.addEventListener('click', () => {
     body.classList.toggle('dark-mode');

     // Save the user preference in localStorage and update the logo
     if (body.classList.contains('dark-mode')) {
         localStorage.setItem('darkMode', 'enabled');
         showLogoText();
     } else {
         localStorage.setItem('darkMode', 'disabled');
         hideLogoText();
     }
 });

 // Show logo text overlay
 function showLogoText() {
     logoText.style.display = 'block'; // Show logo text
 }

 // Hide logo text overlay
 function hideLogoText() {
     logoText.style.display = 'none'; // Hide logo text
 }
