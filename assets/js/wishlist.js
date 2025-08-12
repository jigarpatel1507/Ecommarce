document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.getElementById("wishlist-container");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    wishlist.forEach(product => {
        wishlistContainer.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card border-0 position-relative h-100 product-card">
                    <div class="position-absolute top-0 end-0 p-2 d-flex flex-column gap-2 z-3">
                        <button class="btn btn-light btn-sm rounded-circle icon-btn trash-btn" 
                                data-id="${product.id}"><i class="bi bi-trash"></i></button>
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
                        <p class="text-danger fw-bold mb-1">$${product.price}</p>
                        <div class="text-warning small mb-0">
                            ${'<i class="bi bi-star-fill"></i>'.repeat(product.rating)}
                            ${'<i class="bi bi-star"></i>'.repeat(5 - product.rating)}
                            <span class="text-muted ms-1">(${product.reviews})</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
});

// Logic for removing items from localStorage
document.addEventListener('click', e => {
    if (e.target.closest('.trash-btn')) {
        const btn = e.target.closest('.trash-btn');
        const productId = btn.dataset.id; // Get the product ID from the button's data-id attribute

        // Remove item from wishlist
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(item => item.id !== productId); // Filter out the item with the matching ID
        localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Update localStorage

        // Remove the product card from the DOM
        btn.closest('.col-sm-6').remove();
    }
});