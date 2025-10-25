console.log('Script loaded');
const supabaseUrl = 'https://cjvjogqdfmprvrspyqcb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdmpvZ3FkZm1wcnZyc3B5cWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTU1NjYsImV4cCI6MjA3Njk5MTU2Nn0.q9bmpmT_cPy-JBElUbDv6Xb9AZCIsQ08XgkA6LiF_kk';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cart-toggle');
    const cart = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkout = document.getElementById('checkout');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('addToCartButtons', addToCartButtons.length);

    let cartData = [];

    async function updateCart() {
        const { data, error } = await supabase.from('supabase-kaios-table1').select('*');
        if (error) {
            console.error('Error fetching cart:', error);
            return;
        }
        cartData = data || [];
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
    }

    async function addToCart(id, name, price) {
        console.log('addToCart called with', id, name, price);
        const existingItem = cartData.find(item => item.id === id);
        const quantity = existingItem ? existingItem.quantity + 1 : 1;
        const { error } = await supabase.from('supabase-kaios-table1').upsert({
            id,
            name,
            price: parseFloat(price),
            quantity
        });
        if (error) {
            console.error('Error adding to cart:', error);
        }
        updateCart();
    }

    async function removeFromCart(id) {
        const { error } = await supabase.from('supabase-kaios-table1').delete().eq('id', id);
        if (error) {
            console.error('Error removing from cart:', error);
        }
        updateCart();
    }

    cartToggle.addEventListener('click', () => {
        cart.classList.toggle('hidden');
    });

    addToCartButtons.forEach(button => {
        console.log('Attaching event listener to button', button.dataset.id);
        button.addEventListener('click', async () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = button.dataset.price;
            console.log('Button clicked', id);
            await addToCart(id, name, price);
        });
    });

    cartItems.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            await removeFromCart(id);
        }
    });

    checkout.addEventListener('click', () => {
        alert('Checkout functionality not implemented yet.');
    });

    updateCart();
});