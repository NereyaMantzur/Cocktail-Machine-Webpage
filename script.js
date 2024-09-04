   <script>
        const esp32_ip = 'http://192.168.1.178';

        let cart = [];

        function addToCart(drink, quantity, price) {
            quantity = parseInt(quantity);
            if (quantity > 0) {
                cart.push({ drink, quantity, price });
                updateCartDisplay();
                updateCartCount();
                alert(${quantity} ${drink}(s) added to cart);
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
                cartText.textContent = ${item.quantity} x ${item.drink} ($${item.price} each);

                cartItem.appendChild(cartImage);
                cartItem.appendChild(cartText);
                cartContent.appendChild(cartItem);
            });
            document.getElementById('total-price').textContent = totalPrice.toFixed(2);
        }

        function updateCartCount() {
            document.getElementById('cart-count').textContent = cart.length;
        }

        function placeOrder() {
            console.log("Order placed:", cart);
            alert("Order placed!");
            cart = [];
            updateCartDisplay();
            updateCartCount();
        }

        function toggleCart() {
            const cartSidebar = document.getElementById('cart-sidebar');
            cartSidebar.classList.toggle('open');
        }

        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('show');
        }
    </script>

</body>

</html>


body {
  overflow-x: hidden;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #000;
  color: #fff;
}

/* Top bar, titles, and cocktail names using a serif font */
.top-bar, h1, h2, .cocktailItem h2, .cart-icon {
  font-family: 'Merriweather', serif;
}

/* Top bar */
.top-bar {
  background-color: #111;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  align-items: center;
}

.logo {
  flex: 1;
  text-align: left;
}

.logo img {
  height: 40px;
}

.nav-links {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
}

.nav-links li {
  margin: 0 15px;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  font-family: 'Merriweather', serif;
}

.nav-links a:hover {
  background-color: #333;
}

.cart-icon {
  cursor: pointer;
  color: #fff;
  font-family: 'Merriweather', serif;
  z-index: 1002;
}

/* Hamburger menu for mobile */
.menu-icon {
  display: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1002;
  margin-right: 15px; /* Add margin for spacing between icons */
}

.nav-links.mobile {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 50px;
  right: 0;
  background-color: #111;
  width: 100%;
  z-index: 1000;
}

.nav-links.mobile li {
  padding: 15px 0;
  text-align: center;
  border-bottom: 1px solid #333;
}

.nav-links.mobile a {
  display: block;
  width: 100%;
}

/* Ensure margin below top bar */
.container {
  max-width: 100%;
  margin-top: 100px;
  padding: 40px; /* Increased padding to prevent text cutoff */
  text-align: center;
  background-color: #111;
  padding-bottom: 30px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.175);
}

h1 {
  color: #fff;
  font-size: 36px;
  margin-bottom: 20px;
}

.cocktail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
  padding: 15px;
}

.cocktailItem {
  font-size: larger;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  background-color: #333;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.cocktailItem h2 {
  font-family: 'Merriweather', serif;
}

.cocktailItem img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 15px;
}

button {
  background-color: #000;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}

button:hover {
  background-color: #333;
}

/* Cart Sidebar */
#cart-sidebar {
  position: fixed;
  top: 0;
  right: -1000px; /* Large negative value to hide it initially */
  width: 300px;
  height: 100%;
  background-color: #111;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  padding: 20px;
  transition: right 0.3s ease;
  z-index: 1001;
}

#cart-sidebar.open {
  right: 0; /* Only open when the class 'open' is added */
}

/* Cart item styles */
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.cart-item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}

/* Contact Us form styling */
#contact-form {
  max-width: 700px;
  margin: 0;
  padding: 20px;
  background-color: #222;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

#contact-form label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #fff;
}

#contact-form input,
#contact-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  font-size: 14px;
}

#contact-form button {
  background-color: #333;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
}

#contact-form button:hover {
  background-color: #444;
}

/* Mobile responsiveness */
@media screen and (max-width: 900px) {
  .container {
    padding: 15px;
  }

  h1, h2, p, .cocktailItem {
    text-align: center;
  }

  .cocktail-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .cocktailItem img {
    width: 100%;
    height: auto;
  }

  #cart-sidebar {
    width: 100%; /* Full width on mobile */
  }

  button {
    font-size: 18px;
    padding: 15px;
    width: 100%;
  }

  #contact-form {
    width: 100%;
    padding: 15px;
  }

  /* Show hamburger icon and hide nav links initially */
  .menu-icon {
    display: block;
    color: white;
  }

  .nav-links {
    display: none;
  }

  /* Ensure nav links appear when toggled */
  .nav-links.show {
    display: flex;
    flex-direction: column;
    background-color: #111;
    position: absolute;
    width: 100%;
    top: 50px;
    left: 0;
  }

  .nav-links.show li {
    border-bottom: 1px solid #333;
  }

  .nav-links.show a {
    padding: 15px;
  }
}

/* Anchor link scroll offset fix for top bar */
:target::before {
  content: "";
  display: block;
  height: 80px;
  margin-top: -80px;
}

const esp32_ip = 'http://192.168.1.178';

let cart = [];

function addToCart(drink, quantity, price) {
    quantity = parseInt(quantity);
    if (quantity > 0) {
        cart.push({ drink, quantity, price });
        updateCartDisplay();
        updateCartCount();
        alert(${quantity} ${drink}(s) added to cart);
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
        cartText.textContent = ${item.quantity} x ${item.drink} ($${item.price} each);

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
