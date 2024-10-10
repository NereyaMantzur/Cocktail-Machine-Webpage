// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/make_drink', (req, res) => {
    const fetch = require('node-fetch');
    const { drink, quantity } = req.body;
    const esp32IP = 'http://192.168.1.176'; // Replace with your ESP32 IP address

    fetch(`${esp32IP}/make_drink`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ drink, quantity })
    })
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(500).send('Error communicating with ESP32'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Middleware to parse JSON
app.use(express.json());

// Basic route to test
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// function sendEmail() {
//     // Get the form input values
//     var name = document.getElementById('name').value;
//     var message = document.getElementById('message').value;

//     // URL-encode the inputs to handle Hebrew characters or any special characters
//     var encodedName = encodeURIComponent(name);
//     var encodedMessage = encodeURIComponent(message);

//     // Create the mailto link with the encoded data
//     var mailtoLink = 'mailto:someone@example.com?subject=' + encodedName + '&body=' + encodedMessage;

//     // Open the mailto link (will open the user's email client)
//     window.location.href = mailtoLink;
// }
// Function to toggle mobile menu
window.toggleMenu = function () {
    const navLinks = document.querySelector('.nav-links.mobile');
    navLinks.classList.toggle('show');
};

// Declare checkTotalAndAddToCart as a global function
window.checkTotalAndAddToCart = function () {
    // Get selected amounts
    var amount1 = parseInt(document.getElementById("amount1").value) || 0;
    var amount2 = parseInt(document.getElementById("amount2").value) || 0;
    var amount3 = parseInt(document.getElementById("amount3").value) || 0;

    // Calculate total ml
    var totalAmount = amount1 + amount2 + amount3;

    // Check if total amount is less than or equal to 120 ml
    if (totalAmount <= 120) {
        // Get selected ingredients
        var ingredient1 = document.getElementById("ingredient1").value;
        var ingredient2 = document.getElementById("ingredient2").value;
        var ingredient3 = document.getElementById("ingredient3").value;

        if (!ingredient1 || !ingredient2 || !ingredient3) {
            alert("Please select at least one ingredient.");
            return; // Exit the function if none of the ingredients are selected
        }

        // Add to cart with ingredients and amounts
        addToCart('DIY', 1, 15, ingredient1, amount1, ingredient2, amount2, ingredient3, amount3);
    } else {
        alert("Total must be less or equal to 120 ml.");
    }
};

// Toggle cart display
window.toggleCart = function () {
    const cartSidebar = document.getElementById('cart-sidebar');
    const isOpen = cartSidebar.classList.toggle('open');

};

// Add cocktail to cart (updated version)
window.addToCart = function (drink, quantity, price, ingredient1, amount1, ingredient2, amount2, ingredient3, amount3) {
    quantity = parseInt(quantity);

    if (quantity > 0) {
        if (currentOrderStatus === 'complete') {
            // Dynamically generate the image URL based on the drink name
            const image = `images/${drink.toLowerCase()}.jpg`;

            // Store drink, quantity, price, image, ingredients, and amounts in the cart
            cart = {
                drink,
                quantity,
                price,
                image,
                ingredient1,
                amount1,
                ingredient2,
                amount2,
                ingredient3,
                amount3
            };

            // Update the cart display
            updateCartDisplay();

            // Optionally toggle the cart display
            toggleCart();

            // Alert the user about the added drink
            alert(`${quantity} ${drink}(s) added to cart!`);
        } else {
            alert("Cannot place another order until the current one is complete.");
        }
    } else {
        alert("Please select a valid quantity.");
    }
};



// Close cart if clicking outside
document.addEventListener('click', function (event) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon');

    // Check if the click is outside the cart sidebar and cart icon
    if (!cartSidebar.contains(event.target) && !cartIcon.contains(event.target)) {
        // Close the cart sidebar and set aria-expanded to false
        cartSidebar.classList.remove('open');
        cartIcon.setAttribute('aria-expanded', 'false');
    }
});

// Place order and send it to Firebase
window.placeOrder = async function () {
    if (cart.drink && currentOrderStatus === 'complete') {
        try {
            if (cart.drink === 'DIY') {
                // If it's a DIY cocktail, send ingredients and amounts to Firebase
                await set(ref(database, 'cocktailName'), cart.drink);

                await set(ref(database, 'ingredients/ingredient1'), cart.ingredient1);
                await set(ref(database, 'ingredients/amount1'), cart.amount1);

                await set(ref(database, 'ingredients/ingredient2'), cart.ingredient2);
                await set(ref(database, 'ingredients/amount2'), cart.amount2);

                await set(ref(database, 'ingredients/ingredient3'), cart.ingredient3);
                await set(ref(database, 'ingredients/amount3'), cart.amount3);


            } else {
                // For non-DIY cocktails, only send the cocktail name
                await set(ref(database, 'cocktailName'), cart.drink);
            }

            // Set the order status to pending
            await set(ref(database, 'orderStatus'), "pending");
            currentOrderStatus = "pending";
            alert("Order placed successfully!");

            cart = {}; // Clear the cart after placing the order
            updateCartDisplay();

        } catch (error) {
            console.error("Error sending data to Firebase:", error);
            alert("Error communicating with Firebase. Please check the connection.");
        }
    } else if (currentOrderStatus === 'pending') {
        alert("Order is pending. Wait for the current order to complete.");
    } else {
        alert("Cart is empty. Please add a cocktail to your cart.");
    }
};

// Listen for changes to order status in Firebase
const orderStatusRef = ref(database, 'orderStatus');
onValue(orderStatusRef, (snapshot) => {
    const orderStatus = snapshot.val();
    currentOrderStatus = orderStatus;
});

// Update cart display in the sidebar
function updateCartDisplay() {
    const cartContent = document.getElementById('cart-content');
    let totalPrice = 0;
    cartContent.innerHTML = '';

    if (cart.drink) {
        totalPrice += cart.price * cart.quantity;

        // Create cart item container
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        // Create image element for cocktail
        const cartImage = document.createElement('img');
        cartImage.src = cart.image || 'images/default.png'; // Fallback to a default image if image is missing
        cartImage.alt = `${cart.drink} image`;
        cartImage.className = 'cart-item-image';

        // Create text element for cocktail name and price
        const cartText = document.createElement('p');
        cartText.textContent = `${cart.drink}`;

        // Append the image and text to the cart item
        cartItem.appendChild(cartImage);
        cartItem.appendChild(cartText);

        // Append the cart item to the cart content
        cartContent.appendChild(cartItem);
    }

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}