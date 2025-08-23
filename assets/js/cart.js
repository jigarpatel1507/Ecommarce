document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cart-body");
  const subtotalSpan = document.getElementById("subtotal");
  const totalSpan = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const couponInput = document.querySelector('.input-group input');
  const applyCouponBtn = document.querySelector('.input-group button');
  const couponMessage = document.getElementById("couponMessage");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let appliedCoupon = localStorage.getItem("appliedCoupon") || null;
  let discountRate = 0;

  function isValidCoupon(code) {
    const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const regex = /^([A-Z]{4})([A-Z]{5})(\d{4})([A-Z]{3})$/;
    const match = code.match(regex);
    if (!match) return false;

    const currentYear = new Date().getMonth() >= 3 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    const nextYear = (currentYear + 1).toString().slice(-2);
    const fy = `${currentYear.toString().slice(-2)}${nextYear}`;
    const currentMonth = monthNames[new Date().getMonth()];

    return match[3] === fy && match[4] === currentMonth;
  }

  function showCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartBody.innerHTML = "";

    if (cart.length === 0) {
      cartBody.innerHTML = `<tr><td colspan="4" class="text-center">Your cart is empty.</td></tr>`;
      updateTotal();
      return;
    }

    cart.forEach((item, i) => {
      let quantity = item.quantity || 1;
      let price = Number(item.price) || 0;
      let subtotal = price * quantity;

      cartBody.innerHTML += `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img src="${item.image}" alt="${item.name}" style="width:72px; object-fit:fill" class="me-3">
              ${item.name}
            </div>
          </td>
          <td> ₹${price.toFixed(2)}</td>
          <td>
            <input type="number" min="1" max="10" value="${quantity}" class="form-control w-50 qty" data-index="${i}">
          </td>
          <td> ₹${subtotal.toFixed(2)}</td>
        </tr>
      `;
    });

    updateTotal();
  }

  function updateTotal() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
    let discount = subtotal * discountRate;
    let finalTotal = subtotal - discount;

    subtotalSpan.textContent = `₹${subtotal.toFixed(2)}`;
    totalSpan.textContent = `₹${finalTotal.toFixed(2)}`;
  }

  document.addEventListener("input", e => {
    if (e.target.classList.contains("qty")) {
      let i = e.target.dataset.index;
      cart[i].quantity = parseInt(e.target.value) || 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      showCart();
    }
  });

  applyCouponBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    if (isValidCoupon(code)) {
      discountRate = 0.30;
      appliedCoupon = code;
      localStorage.setItem("appliedCoupon", appliedCoupon);
      couponMessage.innerHTML = `<p class="text-success">Congratulations! you got 30% discount..</p>`;
    } else {
      discountRate = 0;
      appliedCoupon = null;
      localStorage.removeItem("appliedCoupon");
      couponMessage.innerHTML = `<p class="text-danger">Invalid coupon code.</p>`;
    }
    updateTotal();
  });

  if (appliedCoupon && isValidCoupon(appliedCoupon)) {
    discountRate = 0.30;
  }

  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });

  showCart();
});
