document.addEventListener("DOMContentLoaded", () => {
    const cartBody = document.getElementById("cart-body");
    const subtotalSpan = document.getElementById("subtotal");
    const totalSpan = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Show cart items
    function showCart() {
        cartBody.innerHTML = "";

        if (cart.length === 0) {
            cartBody.innerHTML = `<tr><td colspan="4" class="text-center">Your cart is empty.</td></tr>`;
            updateTotal();
            return;
        }

        cart.forEach((item, i) => {
            let quantity = item.quantity || 1;
            let subtotal = item.price * quantity;

            cartBody.innerHTML += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" style="width:72px; height:44px;" class="me-3">
                            ${item.name}
                        </div>
                    </td>
                    <td> ${item.price}</td>
                    <td>
                        <input type="number" min="1" max="10" value="${quantity}" 
                               class="form-control w-50 qty" data-index="${i}">
                    </td>
                    <td>${subtotal}</td>
                </tr>
            `;
        });

        updateTotal();
    }

    // Update total price
    function updateTotal() {
        let total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        subtotalSpan.textContent = `${total}`;
        totalSpan.textContent = `${total}`;
    }

    // Change quantity
    document.addEventListener("input", e => {
        if (e.target.classList.contains("qty")) {
            let i = e.target.dataset.index;
            cart[i].quantity = parseInt(e.target.value);
            localStorage.setItem("cart", JSON.stringify(cart));
            showCart();
        }
    });

    // Checkout button click
    checkoutBtn.addEventListener("click", () => {
        window.location.href = "checkout.html";
    });

    showCart();
});
