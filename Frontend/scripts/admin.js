const API_URL = "http://localhost:5000/api";

// Check authentication on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderAll();
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        alert('Admin access required');
        window.location.href = '../pages/login.html';
        return false;
    }
    return true;
}

function showSection(sectionId) {
    document.querySelectorAll('.panel-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('section-' + sectionId).classList.add('active');
    event.currentTarget.classList.add('active');
    
    renderAll();
}

function renderAll() {
    renderDestinations();
    renderBookings();
    renderInquiries();
    renderUsers();
}

// === DESTINATIONS ===
async function renderDestinations() {
    try {
        const response = await fetch(`${API_URL}/destinations`);
        const data = await response.json();
        const tbody = document.getElementById('destinationsTableBody');
        tbody.innerHTML = '';

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${item.image}" alt="img" style="width:60px;height:40px;object-fit:cover;border-radius:4px;"></td>
                    <td>${item.title}</td>
                    <td>${item.tag}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editDestination('${item._id}')">Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteDestination('${item._id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading destinations:', error);
    }
}

async function deleteDestination(id) {
    if (!confirm("Delete this destination?")) return;
    
    try {
        const response = await fetch(`${API_URL}/destinations/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            renderDestinations();
        } else {
            alert('Failed to delete');
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}

// === BOOKINGS ===
async function renderBookings() {
    try {
        const response = await fetch(`${API_URL}/bookings`);
        const data = await response.json();
        const tbody = document.getElementById('bookingsTableBody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#999;">No bookings yet. Waiting for customers to add trips to their cart.</td></tr>';
            return;
        }

        data.forEach(item => {
            const dateFormatted = new Date(item.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            tbody.innerHTML += `
                <tr>
                    <td>
                        <strong>Travelers:</strong> ${item.people}<br>
                        <small style="color:#666;">${item.notes || 'No notes'}</small>
                    </td>
                    <td><strong>${item.destination}</strong></td>
                    <td>${dateFormatted}</td>
                    <td>
                        <span class="status-badge" style="background:${item.status === 'Confirmed' ? '#28a745' : '#ffb703'}; color:white; padding:5px 12px; border-radius:15px; font-size:0.85em; font-weight:bold;">
                            ${item.status}
                        </span>
                    </td>
                    <td>
                        ${item.status !== 'Confirmed' ? 
                            `<button class="btn-action btn-edit" onclick="approveBooking('${item._id}')">
                                <i class="fas fa-check"></i> Approve
                            </button>` : 
                            '<span style="color:green;">✓ Approved</span>'}
                        <button class="btn-action btn-delete" onclick="deleteBooking('${item._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
        const tbody = document.getElementById('bookingsTableBody');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#dc3545;">⚠️ Unable to load bookings. Please check server connection.</td></tr>';
    }
}

async function approveBooking(id) {
    try {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'PUT',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Confirmed' })
        });

        if (response.ok) {
            renderBookings();
            alert('Booking approved!');
        }
    } catch (error) {
        console.error('Approve error:', error);
    }
}

async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;
    
    try {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) renderBookings();
    } catch (error) {
        console.error('Delete error:', error);
    }
}

// === INQUIRIES ===
async function renderInquiries() {
    try {
        const response = await fetch(`${API_URL}/inquiries`);
        const data = await response.json();
        const tbody = document.getElementById('inquiriesTableBody');
        tbody.innerHTML = '';

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.name} (${item.email})</td>
                    <td>${item.subject}</td>
                    <td>${item.message.substring(0, 50)}...</td>
                    <td>
                        <button class="btn-action btn-delete" onclick="deleteInquiry('${item._id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading inquiries:', error);
    }
}

async function deleteInquiry(id) {
    if (!confirm("Delete this inquiry?")) return;
    
    try {
        const response = await fetch(`${API_URL}/inquiries/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) renderInquiries();
    } catch (error) {
        console.error('Delete error:', error);
    }
}

// === USERS ===
async function renderUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: getAuthHeaders()
        });
        const users = await response.json();
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><button class="btn-action btn-delete" onclick="deleteUser('${user._id}')">Delete</button></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) renderUsers();
    } catch (error) {
        console.error('Delete error:', error);
    }
}

// === HELPER FUNCTIONS ===
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    };
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '../pages/login.html';
}

// Modal functions (destinations)
function openDestinationModal() {
    document.getElementById('destModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('destModal').style.display = 'none';
}