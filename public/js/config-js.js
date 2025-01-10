// public/js/config.js

const CONFIG = {
    API_BASE_URL: '/api',  // Base URL for API endpoints
    CURRENCY_SYMBOL: '₹',
    REFRESH_INTERVAL: 30000, // Status refresh interval in milliseconds
    TABLE_ID: null,  // Will be set after QR code verification
    DEBUG: false     // Toggle debug logging
};

// API Endpoints
const ENDPOINTS = {
    VERIFY_TABLE: '/tables/verify',
    CATEGORIES: '/categories',
    MENU_ITEMS: '/menu-items',
    ORDERS: '/orders',
    ORDER_STATUS: '/orders/status'
};
