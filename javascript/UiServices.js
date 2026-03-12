// 
function getCartAndWishlistState() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];

    return {
        cartIds: new Set(cartItems.map(item => item.id)),
        wishlistIds: new Set(wishlistItems.map(item => item.id)),
    };
}
// 

function createBookCardHTML(book, inCart, inWishlist) {
    const detailUrl = `book.html?id=${encodeURIComponent(book.id)}`;
    return `
                <div data-bookId='${book.id}' class="book-card">

                <button class="wishlist-toggle${inWishlist ? ' wishlist-toggle--active' : ''}" aria-label="Toggle wishlist">
                    <i class="${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>

                <a href="${detailUrl}" class="book-card-link" aria-label="View ${(book.title || 'Book').replace(/"/g, '&quot;')}">
                <div class="book-image">
                    <img class="book-img"
                        src="${book.image || ''}">
                </div>

                <div class="book-content">

                    <div class="book-info">
                        <h3>${book.title || 'Untitled'}</h3>
                        <p>${book.author || '—'}</p>
                        ${book.category ? `<p class="book-meta">${book.category}</p>` : ''}
                    </div>
                </a>

                    <div class="book-footer">
                        <span class="price">₹${book.price != null ? book.price : '—'}</span>
                        <button class="add-cart cart-add" ${inCart ? 'disabled' : ''}>
                            ${inCart ? 'Added' : 'Add to Cart'}
                        </button>
                    </div>

                </div>

            </div>`
}

export function renderBooks(books) {
    const container = document.getElementById('bookContainer');

    container.innerHTML = "";

    const { cartIds, wishlistIds } = getCartAndWishlistState();

    books.forEach(book => {
        const inCart = cartIds.has(book.id);
        const inWishlist = wishlistIds.has(book.id);
        container.innerHTML += createBookCardHTML(book, inCart, inWishlist);
    });
}

export function renderBooksByCategory(books) {
    const container = document.getElementById('bookContainer');
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.innerHTML = `<p>No books found.</p>`;
        return;
    }

    const { cartIds, wishlistIds } = getCartAndWishlistState();

    const groups = books.reduce((acc, book) => {
        const category = book.category
        if (!acc[category]) acc[category] = [];
        acc[category].push(book);
        return acc;
    }, {});

    const sortedCategories = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    sortedCategories.forEach(category => {
        const groupBooks = groups[category];

        container.innerHTML += `
            <section class="category-group">
                <h2 class="category-heading">${category}</h2>
                <div class="category-books-row">
                    ${groupBooks.map(book => {
            const inCart = cartIds.has(book.id);
            const inWishlist = wishlistIds.has(book.id);
            return createBookCardHTML(book, inCart, inWishlist);
        }).join('')}
                </div>
            </section>
        `;
    });
}

export function renderCartItems(cartItems) {
    const container1 = document.getElementById('cart-items-container');
    container1.innerHTML = '';

    if (cartItems.length === 0) {
        container1.innerHTML = `
        
         <div style="background-color: white; border: 2px solid #e2e8f0; border-radius: 25px;padding: 25px;display: flex;flex-direction: column; align-items: center; justify-content: center;height: 100%;gap: 10px;" >
                    <h1>Your Cart is empty</h1>
                    <p>Looks like you haven't added any books yet!</p>
                    <a style="background-color: #4338ca;color: white;padding: 10px 20px;border-radius: 15px;text-decoration: none;" href="books.html">Start Shopping</a>
                </div>
`
    }



    cartItems.forEach(item => {

        container1.innerHTML += `

        <div data-cart-item-id="${item.id}" class="cart-card">

            <div class="cart-product">

                <div class="cart-image">
                    <img class="cart-img"  src="${item.image}" alt="">
                </div>

                <div class="cart-info">
                    <p class="cart-title">${item.title}</p>
                    <p class="cart-author">${item.author}</p>
                    <p class="cart-price">₹ ${item.price}</p>
                </div>

            </div>


            <div class="cart-actions">

                <div class="quantity-box">

                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>

                </div>

                <button class="remove-item remove-btn">
                    <i class="fa-regular fa-trash-can"></i>
                </button>

            </div>

        </div>

        `;
    });

}


export function renderOrderSummary(cartItems, coupon) {
    if (!cartItems || cartItems.length === 0) {
        const totalPrice = document.getElementById('totalPrice');
        const shippingPrice = document.getElementById('shippingPrice');
        const shippingInfo = document.getElementById('shippingInfo');
        const finalPrice = document.getElementById('finalPrice');
        const discountedPrice = document.getElementById('discountedPrice');
        const applyDiscount = document.getElementById('applyDiscount');
        const discountCouponName = document.getElementById('discountCouponName');

        if (totalPrice) totalPrice.textContent = '0';
        if (shippingPrice) {
            shippingPrice.textContent = '0';
            shippingPrice.style.color = '';
        }
        if (shippingInfo) shippingInfo.textContent = '';
        if (finalPrice) {
            finalPrice.textContent = '0';
            finalPrice.style.color = '';
        }
        if (discountedPrice) discountedPrice.textContent = '0';
        if (applyDiscount) applyDiscount.style.display = 'none';
        if (discountCouponName) discountCouponName.textContent = '';
        return;
    }

    const totalPrice = document.getElementById('totalPrice');
    const shippingPrice = document.getElementById('shippingPrice');
    const shippingInfo = document.getElementById('shippingInfo');
    const finalPrice = document.getElementById('finalPrice');
    const discountedPrice = document.getElementById('discountedPrice');

    const totalPriceAfterCalculation = cartItems.reduce((acc, cv) => {
        return acc + (cv.price * cv.quantity)
    }, 0)

    let discountCoupon = 0;

    const applyDiscount = document.getElementById('applyDiscount')
    const discountCouponName = document.getElementById('discountCouponName')
    if (coupon) {
        applyDiscount.style.display = "flex"
        discountCouponName.textContent = coupon
        discountedPrice.textContent = `${Math.round(totalPriceAfterCalculation * 5 / 100)}`
        discountCoupon = Math.round(totalPriceAfterCalculation * 5 / 100)
    } else {
        applyDiscount.style.display = "none"
        discountCouponName.textContent = ""
        discountCoupon = 0;
    }

    totalPrice.innerText = totalPriceAfterCalculation;
    if (totalPriceAfterCalculation > 2500) {
        shippingPrice.textContent = 'Free'
        shippingPrice.style.color = 'green'
        shippingInfo.textContent = ""
    } else {
        shippingPrice.textContent = Number((totalPrice.innerText * 6.5 / 100).toFixed(2))
        shippingPrice.style.color = 'red'
        shippingInfo.textContent = `Add items worth ${2500 - totalPrice.innerText} to get free shipping`

    }

    finalPrice.innerText = Number(((Number(totalPriceAfterCalculation) || 0) + (Number(shippingPrice.textContent) || 0) - (Number(discountCoupon) || 0)).toFixed(2));
    finalPrice.style.color = 'green'
}


export function renderOrderList(orders) {


    const container = document.getElementById('orderContainer')

    if (orders.length === 0) {
        container.innerHTML = '';
        container.innerHTML = `<div
                style="background-color: white; border: 2px solid #e2e8f0; border-radius: 25px;padding: 25px;display: flex;flex-direction: column; align-items: center; justify-content: center;height: 500px;gap: 20px;width : 100% ">
                <h1>No orders found</h1>
                <p>Looks like you didn't buy anything yet!</p>
                <a style="background-color: #4338ca;color: white;padding: 10px 20px;border-radius: 15px;text-decoration: none;"
                    href="books.html">Start Shopping</a>
            </div>`
        return;
    }

    container.innerHTML = '';

    orders.forEach(order => {
        container.innerHTML += `
        <div class="order-card">

            <div class="order-header">
                <div class="order-header-left">

                    <div class="order-info">
                        <p>Order Id</p>
                        <p class="order-id">${order?.id}</p>
                    </div>

                    <div class="order-info">
                        <p>Date</p>
                        <p>${new Date(order.date).toLocaleDateString()}</p>
                    </div>

                    <div class="order-info">
                        <p>Total</p>
                        <p>₹ ${order?.total}</p>
                    </div>

                </div>

                <button style="border:none;background:white;padding:10px;border:1px solid #e2e8f0;border-radius:10px" class="invoice-btn">Download Invoice</button>
            </div>

            <div class="order-items">

                ${order.items?.map(item => {
            return `
                        <div class="order-item">

                            <div class="orderItemInfo">
                            <div class="item-image">
                                <img src="${item.image}" alt="image">
                            </div>

                            <div class="item-info">
                                <p>${item.title}</p>
                                <p>${item.author} × ${item.quantity}</p>
                            </div>
                            </div>

                            <div>
                               <span>₹ ${item.price * item.quantity}</span>
                            </div>

                        </div>
                    `
        }).join('')}

            </div>

        </div>
    `
    })



}