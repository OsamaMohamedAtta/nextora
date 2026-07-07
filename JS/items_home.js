fetch('products.json')
    .then(response => response.json())
    .then(data => {

        const cart = JSON.parse(localStorage.getItem('cart')) || []

        const swiper_items_sale = document.getElementById("swiper_items_sale")

        const swiper_elctronics = document.getElementById("swiper_elctronics")


        data.forEach(product => {
            if (product.old_price && !product.second_section) {

                const isInCart = cart.some(cartItem => cartItem.id === product.id);

                const currencySymbol = localStorage.getItem('currency') === 'USD' ? '$' : 'EGP';
                const currency = localStorage.getItem('currency');

                product.price = currency === 'USD' ? product.price_usd : product.price;
                product.old_price = currency === 'USD' ? product.old_price_usd : product.old_price;

                const percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100)

                swiper_items_sale.innerHTML += `
             <div class="swiper-slide product">
                        <span class="sale_present">%${percent_disc}</span>

                        <div class="img_product">
                            <a href="product.html?id=${product.id}"><img src="${product.thumbnail}" alt=""></a>
                        </div>

                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>

                        <p class="name_product"><a href="product.html?id=${product.id}">${product.name}</a></p>

                        <div class="price">
                            <p><span>${currencySymbol} ${product.price}</span></p>
                            <p class="old_price">${currencySymbol} ${product.old_price}</p>
                        </div>

                        <div class="icons">
                            <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                                <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'Item in cart' : 'add to cart'}
                            </span>
                            <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                        </div>
                    </div>
            
            `

            }
        })


        data.forEach(product => {
            if (product.second_section) {

                const isInCart = cart.some(cartItem => cartItem.id === product.id)

                const currencySymbol = localStorage.getItem('currency') === 'USD' ? '$' : 'EGP';
                const currency = localStorage.getItem('currency');

                product.price = currency === 'USD' ? product.price_usd : product.price;
                product.old_price = currency === 'USD' ? product.old_price_usd : product.old_price;

                const old_price_Pargrahp = product.old_price ? `<p class="old_price">${currencySymbol} ${product.old_price}</p>` : "";

                const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";


                swiper_elctronics.innerHTML += `


            <div class="swiper-slide product">
                       
                        ${percent_disc_div}
                       <div class="img_product">
                           <a href="product.html?id=${product.id}"><img src="${product.thumbnail}" alt=""></a>
                       </div>

                       <div class="stars">
                           <i class="fa-solid fa-star"></i>
                           <i class="fa-solid fa-star"></i>
                           <i class="fa-solid fa-star"></i>
                           <i class="fa-solid fa-star"></i>
                           <i class="fa-solid fa-star"></i>
                       </div>

                       <p class="name_product"><a href="product.html?id=${product.id}">${product.name}</a></p>

                       <div class="price">
                           <p><span>${currencySymbol} ${product.price}</span></p>
                           ${old_price_Pargrahp}
                       </div>

                       <div class="icons">
                           <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                                <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'Item in cart' : 'add to cart'}
                            </span>
                           <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                       </div>
                   </div>
           
           `

            }
        })
    })