var cart = document.querySelector('.cart');

function open_close_cart() {
    cart.classList.toggle("active")
}

let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list() {
    category_nav_list.classList.toggle("active")
}

let nav_links = document.querySelector(".nav_links")

function open_Menu() {
    nav_links.classList.toggle("active")
}

let currency_select = localStorage.getItem("currency");
if (!currency_select) {
    localStorage.setItem("currency", "EGP")
}

const currencyBtn = document.getElementById("currency-toggle");

currencyBtn.textContent = currency_select == "USD" ? "EGP" : "USD";

currencyBtn.addEventListener("click", () => {
    if (currency_select === "USD") {
        currency_select = "EGP";
    } else {
        currency_select = "USD";
    }

    localStorage.setItem("currency", currency_select);
    currencyBtn.textContent = currency_select == "USD" ? "EGP" : "USD";
    window.location.reload();
});


fetch('products.json')
    .then(response => response.json())
    .then(data => {
        // Cache products for delegated click handler
        window.__PRODUCTS = data;

        // Use event delegation so dynamically-rendered product tiles (index) work
        document.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn_add_cart');
            if (!btn) return;
            const productId = btn.getAttribute('data-id');
            const selectedProductRaw = (window.__PRODUCTS || []).find(product => product.id == productId);
            if (!selectedProductRaw) return;

            const currency = localStorage.getItem('currency');
            const selectedProduct = {
                ...selectedProductRaw,
                price: currency === 'USD' ? selectedProductRaw.price_usd : selectedProductRaw.price,
                old_price: currency === 'USD' ? selectedProductRaw.old_price_usd : selectedProductRaw.old_price,
                // default to 1 for index clicks; product page may override via getSelectedProduct
                quantity: 1,
                selected_size: ''
            };

            addToCart(selectedProduct);

            const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`);
            allMatchingButtons.forEach(b => {
                b.classList.add('active');
                b.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
            });
        });

    });


function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartKey = `${product.id}-${product.selected_size || 'default'}`;
    const existingIndex = cart.findIndex(item => item.cartKey === cartKey);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += product.quantity || 1;
    } else {
        cart.push({ ...product, quantity: product.quantity || 1, cartKey });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}


function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items")

    const cart = JSON.parse(localStorage.getItem('cart')) || []

    var total_Price = 0
    var total_count = 0
    const currencySymbol = localStorage.getItem('currency') === 'USD' ? '$' : 'EGP';

    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    cart.forEach((item, index) => {

        let total_Price_item = item.price * item.quantity;

        total_Price += total_Price_item
        total_count += item.quantity


        cartItemsContainer.innerHTML += `
        
            <div class="item_cart">
                <img src="${item.thumbnail}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">${currencySymbol} ${total_Price_item}</p>
                    <div class="quantity_control">
                        <button class="decrease_quantity" data-index=${index}>-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase_quantity" data-index=${index}>+</button>
                    </div>
                </div>

                <button class="delete_item" data-index="${index}" ><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `
    })


    const price_cart_total = document.querySelector('.price_cart_toral')

    const count_item_cart = document.querySelector('.Count_item_cart')

    const count_item_header = document.querySelector('.count_item_header')

    price_cart_total.innerHTML = `${currencySymbol} ${total_Price}`

    count_item_cart.innerHTML = total_count

    count_item_header.innerHTML = total_count


    const increaseButtons = document.querySelectorAll(".increase_quantity")
    const decreaseButtons = document.querySelectorAll(".decrease_quantity")

    increaseButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = event.target.getAttribute("data-index")
            increaseQuantity(itemIndex)
        })
    })


    decreaseButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = event.target.getAttribute("data-index")
            decreaseQuantity(itemIndex)
        })
    })



    const delteButtons = document.querySelectorAll('.delete_item')

    delteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemIndex = event.target.closest('button').getAttribute('data-index')
            removeFromCart(itemIndex)
        })
    })

}


function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    cart[index].quantity += 1
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
}

function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
}


function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    const removeProduct = cart.splice(index, 1)[0]
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
    updateButoonsState(removeProduct.id)
}

function updateButoonsState(productId) {
    const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
    allMatchingButtons.forEach(button => {
        button.classList.remove('active');
        button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`
    })
}

updateCart()