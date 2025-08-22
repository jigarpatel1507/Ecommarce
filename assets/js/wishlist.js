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
                        <button id="trash-btn" class="btn btn-light btn-sm rounded-circle icon-btn trash-btn" 
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
    });
});

// Logic for handling clicks
document.addEventListener('click', e => {
    if (e.target.closest('.trash-btn')) {
        const btn = e.target.closest('.trash-btn');
        const productId = btn.dataset.id; // Get the product ID from the button's data-id attribute

        // Remove item from wishlist
        addToStorage('wishlist', { id: productId }, 'remove');
        btn.closest('.col-sm-6').remove();
    }

    if (e.target.closest('.add-to-cart-hover')) {
        const btn = e.target.closest('.add-to-cart-hover');
        const card = btn.closest('.product-card');

        const productData = {
            id: card.querySelector('.trash-btn').dataset.id,
            name: card.querySelector('.card-title').textContent,
            price: parseFloat(card.querySelector('.text-danger').textContent.replace('$', '')),
            image: card.querySelector('.product-img').src,
            rating: card.querySelector('.text-warning').dataset.rating || 0,
            reviews: card.querySelector('.text-warning').dataset.reviews || 0
        };

        addToStorage('cart', productData, 'add');
        alert(`${productData.name} added to cart`);
    }
});

// Helper function to add or remove items from localStorage
function addToStorage(storageKey, productData, operation) {
    let items = JSON.parse(localStorage.getItem(storageKey)) ?? [];

    if (operation === 'add') {
        const existingProduct = items.find(item => item.id === productData.id);

        if (existingProduct) {
            alert(`${productData.name} is already in the ${storageKey}.`);
        } else {
            items.push(productData);
            localStorage.setItem(storageKey, JSON.stringify(items));
        }
    } else if (operation === 'remove') {
        items = items.filter(item => item.id !== productData.id); // Remove the item with the matching ID
        localStorage.setItem(storageKey, JSON.stringify(items));
    }
}