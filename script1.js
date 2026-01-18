/**
 * Toggles the visibility of the navigation links on mobile devices.
 * Assumes the HTML uses a structure like:
 * <nav class="navbar">
 * <button class="nav-toggle"></button> // The hamburger icon
 * <ul class="nav-links">...</ul>
 * </nav>
 */
function setupNavbarToggle() {
    // 1. Get the navigation links list
    const navLinks = document.querySelector('.nav-links');

    // 2. Create and insert a toggle button (Hamburger icon) dynamically for simplicity,
    //    or get an existing button if it's already in the HTML.
    let toggleBtn = document.querySelector('.nav-toggle');

    if (!toggleBtn) {
        // If the button doesn't exist, let's assume we need to create one
        // and add it to the navbar for mobile view.
        const navbar = document.querySelector('.navbar');
        if (navbar) {
             toggleBtn = document.createElement('button');
             toggleBtn.classList.add('nav-toggle');
             toggleBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Requires Font Awesome library
             navbar.appendChild(toggleBtn);
        }
    }

    // 3. Add an event listener to the toggle button
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            // Toggle an 'open' class on the links container to show/hide it via CSS
            navLinks.classList.toggle('open');
            
            // Optional: Change the icon (hamburger to 'X')
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                 if (navLinks.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                 } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                 }
            }
        });
    }
}

// Run the setup function when the page content is fully loaded
document.addEventListener('DOMContentLoaded', setupNavbarToggle);

// You would also need CSS rules for '.nav-links.open' and hide/show logic for '.nav-toggle'
// depending on screen size.

function setupNavbarToggle() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                // Switches between the "hamburger" and "X" icon
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', setupNavbarToggle);