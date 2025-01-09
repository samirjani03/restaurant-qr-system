const tableNumber = 1; // Mock table number for demo

// Fetch menu items
function fetchMenu() {
    fetch(`/backend/api/menu.php`)
        .then(response => response.json())
        .then(data => {
            const menuDiv = document.getElementById('menu');
            data.forEach(item => {
                menuDiv.innerHTML += `
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>₹${item.price}</p>
                        <button onclick="addToOrder(${item.id})">Add to Order</button>
                    </div>
                `;
            });
        });
}

// Add items to order
let order = [];
function addToOrder(itemId) {
    order.push(itemId);
    alert('Item added to order!');
}

// View order summary
function viewOrder() {
    const summaryDiv = document.getElementById('orderSummary');
    summaryDiv.innerHTML = order.join(', ');
}

// Submit order
function submitOrder() {
    fetch(`/backend/api/order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, order })
    })
    .then(response => response.json())
    .then(data => alert('Order submitted!'))
    .catch(err => console.error(err));
}
