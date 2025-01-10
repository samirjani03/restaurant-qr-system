// public/js/main.js

let cart;
let currentOrderId = null;
let statusCheckInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
    cart = new Cart();
    
    // Initialize based on QR code
    const urlParams = new URLSearchParams(window.location.search);
    const qrCode = urlParams.get('qr');

    if (!qrCode) {
        showError('Invalid QR code. Please scan again.');
        return;
    }

    try {
        await initializeApp(qrCode);
    } catch (error) {
        showError('Failed to initialize the application. Please try again.');
    }
});

async function initializeApp(qrCode) {
    showLoading(true);
    try {
        // Verify table
        const tableInfo = await APIService.verifyTable(qrCode);
        CONFIG.TABLE_ID = tableInfo.table_id;
        document.getElementById('tableNumber').textContent = tableInfo.table_number;

        // Load initial data
        const [categories, menuItems] = await Promise.all([
            APIService.getCategories(),
            APIService.getMenuItems()
        ]);

        // Render UI
        renderCategories(categories);
        renderMenuItems(menuItems);

        // Setup cart
        cart.addObserver(updateCartUI);
        setupEventListeners();

    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to load menu data.');
    } finally {
        showLoading(false);
    }
}

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
            <img src="${item.image_url}" alt="${item.name}" loading="lazy">
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
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span>${CONFIG.CURRENCY_SYMBOL}${(item.price * quantity).toFixed(2)}</span>
            </div>
            <div class="quantity-controls">
                <button class="quantity-decrease">-</button>
                <span class="quantity">${quantity}</span>
                <button class="quantity-increase">+</button>
                <button class="remove-item">×</button>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = `${CONFIG.CURRENCY_SYMBOL}${cart.getTotal().toFixed(2)}`;
}

function setupEventListeners() {
    // Category selection
    document.getElementById('categoryList').addEventListener('click', async (e) => {
        const categoryItem = e.target.closest('.category-item');
        if (categoryItem) {
            const categoryId = categoryItem.dataset.categoryId;
            const items = await APIService.getMenuItems(categoryId);
            renderMenuItems(items);
        }
    });

    // Add to cart
    document.getElementById('menuItems').addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const menuItem = e.target.closest('.menu-item');
            const itemId = menuItem.dataset.itemId;
            const items = await APIService.getMenuItems();
            const item = items.find(i => i.item_id === parseInt(itemId));
            if (item) {
                cart.addItem(item);
            }
        }
    });

    // Cart quantity controls
    document.getElementById('cartItems').addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;

        const itemId = parseInt(cartItem.dataset.itemId);

        if (e.target.classList.contains('quantity-increase')) {
            const currentQuantity = cart.items.get(itemId).quantity;
            cart.updateQuantity(itemId, currentQuantity + 1);
        }
        else if (e.target.classList.contains('quantity-decrease')) {
            const currentQuantity = cart.items.get(itemId).quantity;
            cart.updateQuantity(itemId, currentQuantity - 1);
        }
        else if (e.target.classList.contains('remove-item')) {
            cart.removeItem(itemId);
        }
    });

    // Place order
    document.getElementById('placeOrder').addEventListener('click', async () => {
        if (cart.items.size === 0) {
            showError('Please add items to your cart before placing an order.');
            return;
        }

        try {
            showLoading(true);
            const response = await APIService.placeOrder(cart.getOrderData());
            currentOrderId = response.order_id;
            startOrderStatusCheck();
            cart.clear();
            showSuccess('Order placed successfully!');
        } catch (error) {
            showError('Failed to place order. Please try again.');
        } finally {
            showLoading(false);
        }
    });
}

function startOrderStatusCheck() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }

    statusCheckInterval = setInterval(async () => {
        if (!currentOrderId) return;

        try {
            const status = await APIService.getOrderStatus(currentOrderId);
            updateOrderStatus(status);

            if (status.status === 'completed' || status.status === 'cancelled') {
                clearInterval(statusCheckInterval);
                currentOrderId = null;
            }
        } catch (error) {
            console.error('Failed to check order status:', error);
        }
    }, CONFIG.REFRESH_INTERVAL);
}

function updateOrderStatus(status) {
    const statusElement = document.getElementById('orderStatus');
    statusElement.classList.remove('hidden');
    statusElement.querySelector('.status-content').innerHTML = `
        <p>Order Status: ${status.status}</p>
        <p>Last Updated: ${new Date(status.updated_at).toLocaleTimeString()}</p>
    `;
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    const toast = document.getElementById('errorToast');
    toast.querySelector('.error-message').textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function showSuccess(message) {
    // You can implement a success toast similar to error toast
    alert(message); // Temporary implementation
}
