const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    // Navbar Toggle Logic
    const toggleBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = toggleBtn.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const messageBox = document.getElementById("authMessage");

            try {
                const response = await fetch(`${API_URL}/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store user data and token
                    const userData = {
                        _id: data._id,
                        name: data.name,
                        email: data.email,
                        role: data.role
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', data.token);

                    messageBox.style.display = 'block';
                    messageBox.style.color = 'green';
                    messageBox.style.background = '#e6ffed';
                    messageBox.innerHTML = `Welcome back, ${data.name}! Redirecting...`;

                    setTimeout(() => {
                        if (data.role === 'admin') {
                            window.location.href = '../pages/admin.html';
                        } else {
                            window.location.href = '../index.html';
                        }
                    }, 1500);
                } else {
                    messageBox.style.display = 'block';
                    messageBox.style.color = 'red';
                    messageBox.style.background = '#ffe6e6';
                    messageBox.innerHTML = data.message || 'Invalid credentials';
                }
            } catch (error) {
                console.error('Login error:', error);
                messageBox.style.display = 'block';
                messageBox.style.color = 'red';
                messageBox.style.background = '#ffe6e6';
                messageBox.innerHTML = 'Connection error. Please try again.';
            }
        });
    }

    // Signup Form Handler
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("signupName").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            const messageBox = document.getElementById("authMessage");

            try {
                const response = await fetch(`${API_URL}/users/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageBox.style.display = 'block';
                    messageBox.style.color = 'green';
                    messageBox.style.background = '#e6ffed';
                    messageBox.innerHTML = 'Account created! Redirecting to login...';

                    setTimeout(() => {
                        messageBox.style.display = 'none';
                        toggleForms();
                        signupForm.reset();
                    }, 1500);
                } else {
                    messageBox.style.display = 'block';
                    messageBox.style.color = 'orange';
                    messageBox.style.background = '#fff8e1';
                    messageBox.innerHTML = data.message || 'Registration failed';
                }
            } catch (error) {
                console.error('Signup error:', error);
                messageBox.style.display = 'block';
                messageBox.style.color = 'red';
                messageBox.style.background = '#ffe6e6';
                messageBox.innerHTML = 'Connection error. Please try again.';
            }
        });
    }
});

// Toggle between Login and Signup forms
function toggleForms() {
    const loginSec = document.getElementById("loginSection");
    const signupSec = document.getElementById("signupSection");
    const messageBox = document.getElementById("authMessage");

    if (messageBox) messageBox.style.display = 'none';
    
    if (loginSec && signupSec) {
        if (loginSec.style.display === "none") {
            loginSec.style.display = "block";
            signupSec.style.display = "none";
            document.getElementById("loginForm").reset();
        } else {
            loginSec.style.display = "none";
            signupSec.style.display = "block";
            document.getElementById("signupForm").reset();
        }
    }
}