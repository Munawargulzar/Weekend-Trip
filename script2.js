const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    setupNavbarToggle();
    loadDestinations();
});

function setupNavbarToggle() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
}

// Load destinations from backend
async function loadDestinations() {
    try {
        const response = await fetch(`${API_URL}/destinations`);
        
        if (!response.ok) {
            console.error('Failed to load destinations');
            return;
        }

        const data = await response.json();
        const container = document.querySelector('.destinations');
        
        if (!container) return;

        container.innerHTML = ''; // Clear existing content

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'destination-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <h3>${item.title}</h3>
                <span style="display:inline-block; background:#00b4d8; color:white; padding:5px 12px; border-radius:5px; margin:10px 0; font-size:0.8em; font-weight:600;">${item.tag}</span>
                <p>${item.desc}</p>
                <button onclick="addToCart('${item.title}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading destinations:', error);
        alert('Unable to load destinations. Please check your connection.');
    }
}

// Search functionality
function searchDestinations() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".destination-card");

    cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const desc = card.querySelector("p").textContent.toLowerCase();
        
        if (title.includes(input) || desc.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// View destination details (you can enhance this)
function viewDetails(id) {
    // For now, just redirect to trip planner
    window.location.href = './trip-planner.html';
}

// Add destination to cart
async function addToCart(destinationTitle) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to add items to cart!');
        window.location.href = './login.html';
        return;
    }

    try {
        // Create a booking with default values
        const bookingData = {
            destination: destinationTitle,
            date: getTomorrowDate(), // Set default date to tomorrow
            people: 2, // Default 2 people
            notes: `Added from Explore page`,
            status: 'Pending'
        };

        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            // Show success message
            alert(`✅ ${destinationTitle} has been added to your cart!\n\nYou can update the date and number of travelers in your cart.`);
            
            // Ask if user wants to view cart
            const viewCart = confirm('Would you like to view your cart now?');
            if (viewCart) {
                window.location.href = './cart.html';
            }
        } else {
            const error = await response.json();
            alert('Failed to add to cart: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('Connection error. Please check if the server is running.');
    }
}

// Helper function to get tomorrow's date
function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

// Add Enter key support for search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchDestinations();
            }
        });
    }
});