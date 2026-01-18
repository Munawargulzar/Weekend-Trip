// scripts/script6.js - Cart System (FINAL FIXED VERSION)
const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cart page loaded');
    
    // Navbar Toggle
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
    }

    // Load cart items
    displayCart();
});

async function displayCart() {
    const cartList = document.getElementById('cart-items'); 
    const emptyMsg = document.getElementById('empty-cart-msg');
    const summary = document.getElementById('cart-summary');
    
    // Show loading
    if (cartList) {
        cartList.innerHTML = '<div style="text-align:center; padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:2em; color:#0077b6;"></i><p style="color:#555; margin-top:15px;">Loading your bookings...</p></div>';
    }
    
    try {
        console.log('Fetching bookings...');
        
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('User from localStorage:', user);
        
        // Build headers
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add auth token if available
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
            console.log('Using auth token');
        } else {
            console.log('No user or token found');
        }
        
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'GET',
            headers: headers
        });
        
        console.log('Response status:', response.status);
        
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
            console.log('Authentication required or failed');
            if (cartList) {
                cartList.innerHTML = `
                    <div style="text-align:center; padding:50px; background:#fff3cd; border-radius:12px; border-left:5px solid #ffc107;">
                        <i class="fas fa-lock" style="font-size:4em; color:#ffc107; margin-bottom:20px;"></i>
                        <h3 style="color:#856404; margin-bottom:15px;">Login Required</h3>
                        <p style="color:#856404; margin-bottom:20px;">Please log in to view your cart and manage your bookings.</p>
                        <a href="login.html" style="display:inline-block; padding:12px 30px; background:#0077b6; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">
                            <i class="fas fa-sign-in-alt"></i> Go to Login
                        </a>
                    </div>
                `;
            }
            if (emptyMsg) emptyMsg.style.display = 'none';
            if (summary) summary.style.display = 'none';
            return;
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Server error: ${response.status}`);
        }

        const bookings = await response.json();
        console.log('Bookings loaded:', bookings);

        // Empty cart
        if (!bookings || bookings.length === 0) {
            console.log('No bookings found');
            if (cartList) cartList.innerHTML = '';
            if (emptyMsg) emptyMsg.style.display = 'block';
            if (summary) summary.style.display = 'none';
            return;
        }

        // Display bookings
        console.log('Displaying', bookings.length, 'bookings');
        if (emptyMsg) emptyMsg.style.display = 'none';
        if (summary) summary.style.display = 'flex';
        
        const totalCount = document.getElementById('total-count');
        if (totalCount) totalCount.textContent = bookings.length;

        if (cartList) {
            cartList.innerHTML = bookings.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <h3>${item.destination || 'Unknown Destination'}</h3>
                        <p><strong>Date:</strong> ${formatDate(item.date)}</p>
                        <p><strong>Travelers:</strong> ${item.people || 1} ${(item.people || 1) > 1 ? 'people' : 'person'}</p>
                        ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ''}
                        <span class="status-tag ${(item.status || 'pending').toLowerCase()}">${item.status || 'Pending'}</span>
                    </div>
                    <button class="btn-remove" onclick="deleteItem('${item._id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error('Cart loading error:', error);
        
        if (cartList) {
            cartList.innerHTML = `
                <div style="text-align:center; padding:40px; background:#ffe6e6; border-radius:12px; border-left:5px solid #dc3545;">
                    <i class="fas fa-exclamation-triangle" style="font-size:3em; color:#dc3545; margin-bottom:15px;"></i>
                    <h3 style="color:#721c24;">Connection Error</h3>
                    <p style="color:#721c24; margin: 10px 0;">Unable to connect to the server.</p>
                    <p style="color:#6c757d; font-size:0.9em; margin-bottom:20px;">${error.message}</p>
                    <button onclick="displayCart()" style="margin-right:10px; padding:12px 24px; background:#0077b6; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">
                        <i class="fas fa-sync"></i> Try Again
                    </button>
                    <a href="../pages/explore.html" style="display:inline-block; padding:12px 24px; background:#6c757d; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">
                        <i class="fas fa-arrow-left"></i> Back
                    </a>
                </div>
            `;
        }
        
        if (emptyMsg) emptyMsg.style.display = 'none';
        if (summary) summary.style.display = 'none';
    }
}

async function deleteItem(id) {
    if (!confirm('Remove this booking from your cart?')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
        alert('Please login to manage your bookings');
        window.location.href = 'login.html';
        return;
    }

    try {
        console.log('Deleting booking:', id);
        
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }

        if (response.ok) {
            console.log('Booking deleted successfully');
            showNotification('Booking removed successfully!', 'success');
            displayCart(); // Reload cart
        } else {
            const errorText = await response.text();
            console.error('Delete failed:', errorText);
            alert('Failed to remove booking. Please try again.');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error: ' + error.message);
    }
}

function processCheckout() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
        alert('Please login to complete checkout!');
        window.location.href = 'login.html';
        return;
    }
    
    const confirmed = confirm('Confirm all bookings?\n\nYou will receive confirmation details shortly.');
    if (!confirmed) return;
    
    alert('✓ Thank you! Your bookings are confirmed.\n\nWe will contact you with trip details.');
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        console.error('Date formatting error:', e);
        return dateString;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#28a745' : '#dc3545';
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
    `;
    
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}