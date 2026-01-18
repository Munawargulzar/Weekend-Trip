// scripts/auth-nav.js
// Handles authentication state in navigation across all pages

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    setupNavbarToggle();
});

function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.querySelector('.nav-links');
    
    if (!navLinks) return;

    // Find the login/signup button in nav
    const loginButton = navLinks.querySelector('a[href*="login.html"]');
    
    if (user && user.name) {
        // User is logged in - replace login button with user greeting and logout
        if (loginButton && loginButton.parentElement) {
            loginButton.parentElement.innerHTML = `
                <li class="user-greeting">
                    <span class="greeting-text">Hi, ${user.name}</span>
                    <button class="btn-logout" onclick="handleLogout()">Logout</button>
                </li>
            `;
        }
    } else {
        // User is not logged in - show login/signup button
        if (loginButton && loginButton.parentElement) {
            // Reset to login button if it was changed
            const href = window.location.pathname.includes('pages/') ? 'login.html' : 'pages/login.html';
            loginButton.parentElement.innerHTML = `
                <li><a href="${href}" class="btn-primary">Login / Sign Up</a></li>
            `;
        }
    }
}

function handleLogout() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to log out?');
    
    if (confirmed) {
        // Clear user data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Show logout message
        alert('You have been logged out successfully!');
        
        // Redirect to home page
        if (window.location.pathname.includes('pages/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    }
}

function setupNavbarToggle() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
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

// Make handleLogout available globally for onclick
window.handleLogout = handleLogout;