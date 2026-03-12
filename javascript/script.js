import { defaultBooks } from './defaultBooks.js'
import { defaultOrders } from './defaultOrders.js'

const featuredContainer = document.getElementById("featuredBooks");
const sliderImages = document.getElementById('sliderImages');
const sliderImage = document.getElementById('sliderImage');


function initializeStorage() {
  const books = localStorage.getItem("books");
  const orders = localStorage.getItem('orders');
  console.log(books)
  console.log(orders)

  if (!books || !orders) {
    localStorage.setItem('books', JSON.stringify(defaultBooks))
    localStorage.setItem("orders", JSON.stringify(defaultOrders))
  }
}





document.addEventListener('DOMContentLoaded', () => {
  initializeStorage()
  const books = JSON.parse(localStorage.getItem("books")) || [];
  sliderImages.src = books[0].image

  sliderImage.innerHTML = '';

  const book = Math.floor(Math.random() * books.length)


  const detailUrl = `book.html?id=${encodeURIComponent(books[book].id)}`;
  sliderImage.innerHTML = `<a href=${detailUrl}> <img id="sliderImages" src=${books[book].image}
                        alt=""> </a>`

  sliderImages.src = books[book].image

})


if (featuredContainer) {
  const books = JSON.parse(localStorage.getItem("books")) || [];

  function pickRandomBooks(source, count) {
    if (!source.length) return [];
    const copy = [...source];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  }

  function renderFeatured(list) {
    featuredContainer.innerHTML = "";

    list.forEach((book) => {
      const detailUrl = `book.html?id=${encodeURIComponent(book.id)}`;
      featuredContainer.innerHTML += `
                <div class="book-card">
                    <a href="${detailUrl}" class="book-card-link">
                    <div class="book-image">
                        <img src="${book.image}" alt="${(book.title || 'Book').replace(/"/g, '&quot;')}">
                    </div>
                    <div class="book-content">
                        <div class="book-info">
                            <h3>${book.title || 'Untitled'}</h3>
                            <p>${book.author || '—'}</p>
                        </div>
                    </a>
                        <div class="book-footer">
                            <span class="price">₹${book.price != null ? book.price : '—'}</span>
                            <a href="${detailUrl}" class="add-cart" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none;">
                                View
                            </a>
                        </div>
                    </div>
                </div>
            `;
    });
  }

  const initial = pickRandomBooks(books, 6);
  renderFeatured(initial);


}




const books = JSON.parse(localStorage.getItem("books")) || [];

setInterval(() => {
  sliderImage.innerHTML = '';

  const book = Math.floor(Math.random() * books.length)


  const detailUrl = `book.html?id=${encodeURIComponent(books[book].id)}`;
  sliderImage.innerHTML = `<a href=${detailUrl}> <img id="sliderImages" src=${books[book].image}
                        alt=""> </a>`

  sliderImages.src = books[book].image

}, 1000);

sliderImages.addEventListener('click', () => {
  window.location.href = 'books.html'
})
