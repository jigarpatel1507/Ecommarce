document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cards-container");

  fetch('../data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(products => {
      // get wishlist from localStorage first
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      products.forEach(product => {
        // check if product is already in wishlist
        const isInWishlist = wishlist.some(item => item.id === String(product.id));

        const card = `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card border-0 position-relative h-100 product-card">

          <div class="position-absolute top-0 end-0 p-2 d-flex flex-column gap-2 z-3">
            <button class="btn btn-light btn-sm rounded-circle icon-btn wishlist-btn" 
                    data-id="${product?.id}"
                    data-name="${product?.name}"
                    data-price="${product?.price}"
                    data-image="${product?.image}"
                    data-rating="${product?.rating}" 
                    data-reviews="${product?.reviews}"> 
              <i class="bi ${isInWishlist ? "bi-heart-fill text-danger" : "bi-heart"}"></i>
            </button>
            <button class="btn btn-light btn-sm rounded-circle icon-btn">
              <i class="bi bi-eye"></i>
            </button>
          </div>

          <div class="image-box">
            <img src="${product.image}" alt="${product.name}" class="product-img">
          </div>

          <div class="add-to-cart-hover-wrapper w-100">
            <button class="btn btn-dark text-white add-to-cart-hover w-100">
              Add To Cart
            </button>
          </div>

          <div class="card-body text-start">
            <h6 class="card-title mb-1">${product.name}</h6>
            <p class="text-danger fw-bold mb-1">${product.price}</p>
            <div class="text-warning small mb-0">
              ${'<i class="bi bi-star-fill"></i>'.repeat(product.rating)}
              ${'<i class="bi bi-star"></i>'.repeat(5 - product.rating)}
              <span class="text-muted ms-1">(${product.reviews})</span>
            </div>
          </div>

        </div>
      </div>
    `;
        container.innerHTML += card;
      });
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });
});

//logic for adding items to wishlist

document.addEventListener('click', e => {
  // Wishlist button clicked
  if (e.target.closest('.wishlist-btn')) {
    const btn = e.target.closest('.wishlist-btn');
    const icon = btn.querySelector("i");

    const productData = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: btn.dataset.price,
      image: btn.dataset.image,
      rating: btn.dataset.rating || 0,
      reviews: btn.dataset.reviews || 0
    };

    // Save to localStorage
    addToStorage('wishlist', productData);

    // Toggle heart color + filled
    icon.classList.toggle("bi-heart");
    icon.classList.toggle("bi-heart-fill");
    icon.classList.toggle("text-danger");
  }


  // Add to cart clicked
  if (e.target.closest('.add-to-cart-hover')) {
    const btn = e.target.closest('.add-to-cart-hover');
    const card = btn.closest('.product-card');

    const productData = {
      id: card.querySelector('.wishlist-btn').dataset.id,
      name: card.querySelector('.wishlist-btn').dataset.name,
      price: card.querySelector('.wishlist-btn').dataset.price,
      image: card.querySelector('.wishlist-btn').dataset.image,
      rating: card.querySelector('.wishlist-btn').dataset.rating || 0,
      reviews: card.querySelector('.wishlist-btn').dataset.reviews || 0
    };
    addToStorage('cart', productData);
    alert(`${productData.name} added to cart`);
  }
});

function addToStorage(storageKey, productData) {
  let items = JSON.parse(localStorage.getItem(storageKey)) || [];
  if (!items.some(item => item.id === productData.id)) {
    items.push(productData);
    localStorage.setItem(storageKey, JSON.stringify(items));
  }
}

