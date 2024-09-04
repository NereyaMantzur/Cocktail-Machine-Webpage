let cart = [];

function addToCart(drink, quantity, price) {
    quantity = parseInt(quantity);
    if (quantity > 0) {
        // Check if the item is already in the cart
        let itemInCart = cart.find(item => item.drink === drink);
        if (itemInCart) {
            itemInCart.quantity += quantity;  // Increase quantity if already in cart
        } else {
            cart.push({ drink, quantity, price });  // Add new item to cart
        }
        updateCartDisplay();
        updateCartCount();
        alert(`${quantity} ${drink}(s) added to cart`);
    } else {
        alert("Please select a valid quantity.");
    }
}

function updateCartDisplay() {
    let cartContent = document.getElementById('cart-content');
    let totalPrice = 0;
    cartContent.innerHTML = '';  // Clear cart content
    
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

        // Create buttons for increasing and decreasing quantity
        let decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.onclick = () => {
            decreaseQuantity(index);
        };

        let increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.onclick = () => {
            increaseQuantity(index);
        };

        let quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls';
        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(cartText);
        quantityControls.appendChild(increaseButton);

        cartItem.appendChild(cartImage);
        cartItem.appendChild(quantityControls);
        cartContent.appendChild(cartItem);
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);  // Update total price
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCartDisplay();
    updateCartCount();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);  // Remove item if quantity is 1 and decrease is clicked
    }
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
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

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}
