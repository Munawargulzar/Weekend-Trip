const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    // Navbar Toggle
    const toggleBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const inquiryData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value
            };

            try {
                const response = await fetch(`${API_URL}/inquiries`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(inquiryData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Show confirmation
                    document.getElementById("contactConfirmation").style.display = "block";
                    contactForm.reset();

                    // Hide after 5 seconds
                    setTimeout(() => {
                        document.getElementById("contactConfirmation").style.display = "none";
                    }, 5000);
                } else {
                    alert(data.error || "Failed to send message. Please try again.");
                }
            } catch (error) {
                console.error('Contact form error:', error);
                alert("Connection error. Please check if the server is running.");
            }
        });
    }
});