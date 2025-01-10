// public/js/api.js

class APIService {
    static async request(endpoint, options = {}) {
        try {
            const url = CONFIG.API_BASE_URL + endpoint;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async verifyTable(qrCode) {
        return await this.request(`${ENDPOINTS.VERIFY_TABLE}/${qrCode}`);
    }

    static async getCategories() {
        return await this.request(ENDPOINTS.CATEGORIES);
    }

    static async getMenuItems(categoryId = null) {
        const endpoint = categoryId 
            ? `${ENDPOINTS.MENU_ITEMS}?category=${categoryId}`
            : ENDPOINTS.MENU_ITEMS;
        return await this.request(endpoint);
    }

    static async placeOrder(orderData) {
        return await this.request(ENDPOINTS.ORDERS, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    static async getOrderStatus(orderId) {
        return await this.request(`${ENDPOINTS.ORDER_STATUS}/${orderId}`);
    }
}
