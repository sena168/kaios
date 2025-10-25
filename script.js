console.log('Script loaded');
document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cart-toggle');
    const cart = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkout = document.getElementById('checkout');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('addToCartButtons', addToCartButtons.length);

    let cartData = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        cartData.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name} - $${item.price} x ${item.quantity}</span>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
            itemCount += item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        cartToggle.textContent = `Cart (${itemCount})`;

        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    function addToCart(id, name, price) {
        console.log('addToCart called with', id, name, price);
        const existingItem = cartData.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartData.push({ id, name, price: parseFloat(price), quantity: 1 });
        }
        updateCart();
    }

    function removeFromCart(id) {
        cartData = cartData.filter(item => item.id !== id);
        updateCart();
    }

    cartToggle.addEventListener('click', () => {
        cart.classList.toggle('hidden');
    });

    addToCartButtons.forEach(button => {
        console.log('Attaching event listener to button', button.dataset.id);
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = button.dataset.price;
            console.log('Button clicked', id);
            addToCart(id, name, price);
        });
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            removeFromCart(id);
        }
    });

    checkout.addEventListener('click', () => {
        alert('Checkout functionality not implemented yet.');
    });

    updateCart();
});