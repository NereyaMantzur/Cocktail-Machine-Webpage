
const esp32_ip = 'http://192.168.1.178';

function margarita() {
    fetch(`${esp32_ip}/margarita`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('status').innerText = "LED is ON";
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('status').innerText = "Error: Unable to turn on LED";
        });
}

function martini() {
    fetch(`${esp32_ip}/martini`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('status').innerText = "LED is ON";
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('status').innerText = "Error: Unable to turn on LED";
        });
}

function turnOff() {
    fetch(`${esp32_ip}/turn-off`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('status').innerText = "LED is OFF";
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('status').innerText = "Error: Unable to turn off LED";
        });
}

let cart = [];

function addToCart(drink, quantity, price) {
    quantity = parseInt(quantity);
    if (quantity > 0) {
        cart.push({ drink, quantity, price });
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
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        let cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        let cartImage = document.createElement('img');
        cartImage.src = getImageForDrink(item.drink);
        cartImage.alt = item.drink;
        cartImage.className = 'cart-item-image';

        let cartText = document.createElement('p');
        cartText.textContent = `${item.quantity} x ${item.drink} ($${item.price} each)`;

        cartItem.appendChild(cartImage);
        cartItem.appendChild(cartText);
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
    cart = []; // Clear cart after placing order
    updateCartDisplay();
    updateCartCount();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}
