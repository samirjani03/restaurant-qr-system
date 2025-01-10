// public/js/cart.js

class Cart {
    constructor() {
        this.items = new Map();
        this.observers = new Set();
    }

    addItem(item, quantity = 1) {
        const existingItem = this.items.get(item.item_id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.set(item.item_id, {
                item,
                quantity,
                specialInstructions: ''
            });
        }
        this.notifyObservers();
    }

    removeItem(itemId) {
        this.items.delete(itemId);
        this.notifyObservers();
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.get(itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.notifyObservers();
            }
        }
    }

    updateSpecialInstructions(itemId, instructions) {
        const item = this.items.get(itemId);
        if (item) {
            item.specialInstructions = instructions;
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

    getOrderData() {
        return {
            table_id: CONFIG.TABLE_ID,
            items: Array.from(this.items.values()).map(({ item, quantity, specialInstructions }) => ({
                item_id: item.item_id,
                quantity,
                special_instructions: specialInstructions
            })),
            special_instructions: document.getElementById('specialInstructions').value
        };
    }

    addObserver(callback) {
        this.observers.add(callback);
    }

    removeObserver(callback) {
        this.observers.delete(callback);
    }

    notifyObservers() {
        this.observers.forEach(callback => callback(this));
    }
}
