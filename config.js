// scripts/config.js
// Central configuration file for API endpoints

const CONFIG = {
    API_URL: "http://localhost:5000/api",
    
    // You can add more configuration here
    ENDPOINTS: {
        USERS: "/users",
        LOGIN: "/users/login",
        REGISTER: "/users/register",
        DESTINATIONS: "/destinations",
        BOOKINGS: "/bookings",
        INQUIRIES: "/inquiries"
    }
};

// Make it available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}