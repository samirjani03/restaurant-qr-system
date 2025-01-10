// config.js
const CONFIG = {
    API_BASE_URL: 'http://localhost/api',
    TABLE_ID: null,
    CURRENCY_SYMBOL: '₹'
};

// api.js
class API {
    static async getTableInfo(qrCode) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/tables/verify/${qrCode}`);
        return await response.json();
    }

    static async getCategories() {
        const response = await fetch(`${CONFIG.API_BASE_URL}/categories`);
        return await response.json();
    }

    static async getMenuItems(categoryId = null) {
        const url = categoryId 
            ? `${CONFIG.API_BASE_URL}/menu-items?category=${categoryId}`
            : `${CONFIG.API_BASE_URL}/menu-items`;
        const response = await fetch(url);
        return await response.json();
    }

    static async placeOrder(orderData) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    }

    static async getOrderStatus(orderId) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/orders/${orderId}/status`);
        return await response.json();
    }
}

// cart.js
class Cart {
    constructor() {
        this.items = new Map();
        this.observers = new Set();
    }

    addItem(item, quantity = 1) {
        const existingQuantity = this.items.get(item.item_id)?.quantity || 0;
        this.items.set(item.item_id, {
            item,
            quantity: existingQuantity + quantity
        });
        this.notifyObservers();
    }

    removeItem(itemId) {
        this.items.delete(itemId);
        this.notifyObservers();
    }

    updateQuantity(itemId, quantity) {
        if (quantity <= 0) {
            this.removeItem(itemId);
            return;
        }
        const item = this.items.get(itemId);
        if (item) {
            item.quantity = quantity;
            this.notifyObservers();
        }
    }

    getTotal() {
        let total = 0;
        for (const [_, { item, quantity }] of this.items) {
            total += item.price * quantity;
        }
        return total;
    }

    clear() {
        this.items.clear();
        this.notifyObservers();
    }

    addObserver(callback) {
        this.observers.add(callback);
    }

    notifyObservers() {
        this.observers.forEach(callback => callback(this));
    }
}

// main.js
document.addEventListener('DOMContentLoaded', async () => {
    const cart = new Cart();
    const urlParams = new URLSearchParams(window.location.search);
    const qrCode = urlParams.get('qr');

    if (!qrCode) {
        alert('Invalid QR code');
        return;
    }

    try {
        // Initialize table information
        const tableInfo = await API.getTableInfo(qrCode);
        CONFIG.TABLE_ID = tableInfo.table_id;
        document.getElementById('tableNumber').textContent = tableInfo.table_number;

        // Load categories
        const categories = await API.getCategories();
        renderCategories(categories);

        // Load initial menu items
        const menuItems = await API.getMenuItems();
        renderMenuItems(menuItems);

        // Setup cart observers
        cart.addObserver(updateCartUI);

        // Setup event listeners
        setupEventListeners(cart);

    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to initialize the application');
    }
});

// UI rendering functions...
function renderCategories(categories) {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = categories.map(category => `
        <div class="category-item" data-category-id="${category.category_id}">
            ${category.name}
        </div>
    `).join('');
}

function renderMenuItems(items) {
    const menuItems = document.getElementById('menuItems');
    menuItems.innerHTML = items.map(item => `
        <div class="menu-item" data-item-id="${item.item_id}">
            <img src="${item.image_url}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="item-footer">
                <span class="price">${CONFIG.CURRENCY_SYMBOL}${item.price.toFixed(2)}</span>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function updateCartUI(cart) {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = Array.from(cart.items.values()).map(({ item, quantity }) => `
        <div class="cart-item" data-item-id="${item.item_id}">
            <span>${item.name} x ${quantity}</span>
            <span>${CONFIG.CURRENCY_SYMBOL}${(item.price * quantity).toFixed(2)}</span>
            <div class="quantity-controls">
                <button class="quantity-decrease">-</button>
                <button class="quantity-increase">+</button>
                <button class="remove-