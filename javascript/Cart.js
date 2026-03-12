


function addToCart(id, books) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem) {
        const updatedCartItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );

        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    } else {
        const book = books.find(book => book.id === id);
        if (!book) return;

        const cartItem = { ...book, quantity: 1 };
        cartItems.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
}

export { addToCart }