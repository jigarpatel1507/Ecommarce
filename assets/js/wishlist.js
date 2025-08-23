  // Add product to wishlist
  function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const productData = {
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews
    };

    if (!wishlist.some(item => item.id === productData.id)) {
      wishlist.push(productData);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`${productData.name} added to wishlist`);
    }
  }

  //  Add product to cart (by ID, not full object inline)
  function addToCart(productId) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = wishlist.find(item => item.id === productId);

    if (!product) {
      alert("Product not found in wishlist!");
      return;
    }

    if (!cart.some(item => item.id === product.id)) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart for ₹${product.price}`);
    } else {
      alert(`${product.name} is already in cart`);
    }
  }

  //  Remove product from wishlist
  function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
  }

  //  Render wishlist
  function renderWishlist() {
    const wishlistContainer = document.getElementById("wishlist-container");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }

    wishlist.forEach(product => {
      wishlistContainer.innerHTML += `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="card border-0 position-relative h-100 product-card">
            <div class="position-absolute top-0 end-0 p-2">
              <button class="btn btn-light btn-sm rounded-circle"
                      onclick="removeFromWishlist('${product.id}')">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="image-box">
              <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="add-to-cart-hover-wrapper w-100">
              <button class="btn btn-dark w-100"
                      onclick="addToCart('${product.id}')">
                Add To Cart
              </button>
            </div>
            <div class="card-body text-start">
              <h6 class="card-title mb-1">${product.name}</h6>
              <p class="text-danger fw-bold mb-1">₹${product.price}</p>
            </div>
          </div>
        </div>
      `;
    });
  }

  document.addEventListener("DOMContentLoaded", renderWishlist);