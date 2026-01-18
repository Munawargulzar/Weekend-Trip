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

    // Load destinations into dropdown
    loadDestinations();

    // Trip Form Handler
    const tripForm = document.getElementById("tripForm");
    if (tripForm) {
        tripForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const bookingData = {
                destination: document.getElementById("destination").value,
                date: document.getElementById("date").value,
                people: parseInt(document.getElementById("people").value),
                notes: document.getElementById("notes").value || ""
            };

            try {
                const response = await fetch(`${API_URL}/bookings`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success message
                    document.getElementById("confirmation").style.display = "block";
                    tripForm.reset();

                    // Hide confirmation after 5 seconds
                    setTimeout(() => {
                        document.getElementById("confirmation").style.display = "none";
                    }, 5000);
                } else {
                    alert(data.error || "Booking failed. Please try again.");
                }
            } catch (error) {
                console.error('Booking error:', error);
                alert("Connection error. Please check if the server is running.");
            }
        });
    }
});

// Load destinations from backend
async function loadDestinations() {
    try {
        const response = await fetch(`${API_URL}/destinations`);
        const destinations = await response.json();

        const select = document.getElementById("destination");
        if (select && destinations.length > 0) {
            // Clear existing options except the first one
            select.innerHTML = '<option value="">-- Choose a destination --</option>';
            
            destinations.forEach(dest => {
                const option = document.createElement('option');
                option.value = dest.title;
                option.textContent = dest.title;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading destinations:', error);
    }
}