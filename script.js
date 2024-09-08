const esp32_ip = 'http://192.168.1.178';

let cart = [];

function addToCart(drink, quantity, price) {
    quantity = parseInt(quantity);
    if (quantity > 0) {
        // Check if item already exists in the cart
        const existingItem = cart.find(item => item.drink === drink);
        if (existingItem) {
            existingItem.quantity += quantity;  // Increase quantity if already in cart
        } else {
            cart.push({ drink, quantity, price });
        }
        updateCartDisplay();
        updateCartCount();
        alert(`${quantity} ${drink}(s) added to cart`);
    } else {
        alert("Please select a valid quantity.");
    }
}

function getImageForDrink(drink) {
    switch (drink) {
        case 'Margarita':
            return './images/margarita.jpg';
        case 'Martini':
            return './images/martini.jpg';
        case 'Bloody Mary':
            return './images/bloodyMary.jpg';
        case 'Pina Colada':
            return './images/pinaColada.avif';
        case 'DIY':
            return './images/diy.jpg';
        default:
            return '';
    }
}

function updateCartDisplay() {
    let cartContent = document.getElementById('cart-content');
    let totalPrice = 0;
    cartContent.innerHTML = '';
    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        
        let cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        let cartImage = document.createElement('img');
        cartImage.src = getImageForDrink(item.drink);
        cartImage.alt = item.drink;
        cartImage.className = 'cart-item-image';

        let cartText = document.createElement('p');
        cartText.textContent = `${item.quantity} x ${item.drink} ($${item.price} each)`;

        // Add buttons for increasing/decreasing/removing items
        let decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.onclick = function() {
            updateQuantity(index, -1);  // Decrease quantity
        };

        let increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.onclick = function() {
            updateQuantity(index, 1);  // Increase quantity
        };

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Remove';
        deleteBtn.onclick = function() {
            deleteFromCart(index);  // Remove item
        };

        cartItem.appendChild(cartImage);
        cartItem.appendChild(cartText);
        cartItem.appendChild(decreaseBtn);
        cartItem.appendChild(increaseBtn);
        cartItem.appendChild(deleteBtn);
        cartContent.appendChild(cartItem);
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2); // Update total price
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function placeOrder() {
    console.log("Order placed:", cart);
    alert("Order placed!");
    cart = [];  // Clear cart after placing order
    updateCartDisplay();
    updateCartCount();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}

function updateQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        deleteFromCart(index);  // Remove item if quantity goes to 0
    }
    updateCartDisplay();
    updateCartCount();
}

function deleteFromCart(index) {
    cart.splice(index, 1);  // Remove the item from the cart
    updateCartDisplay();
    updateCartCount();
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}
