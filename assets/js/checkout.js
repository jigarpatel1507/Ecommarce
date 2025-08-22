document.addEventListener("DOMContentLoaded", () => {
    const orderSummary = document.getElementById("orderSummary");
    const orderSubtotal = document.getElementById("orderSubtotal");
    const orderTotal = document.getElementById("orderTotal");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const saveBillingInfoCheckbox = document.getElementById("saveBillingInfo");

    const couponInput = document.getElementById("couponCode");
    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const couponMessage = document.getElementById("couponMessage");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let appliedCoupon = localStorage.getItem("appliedCoupon") || null;
    let discountRate = 0;

    // Coupon validation function
    function isValidCoupon(code) {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const regex = /^([A-Z]{4})([A-Z]{5})(\d{4})([A-Z]{3})$/;
        const match = code.match(regex);
        if (!match) return false;

        // Calculate current financial year
        const now = new Date();
        const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
        const nextYear = (currentYear + 1).toString().slice(-2);
        const fy = `${currentYear.toString().slice(-2)}${nextYear}`;

        const currentMonth = monthNames[now.getMonth()];

        return match[3] === fy && match[4] === currentMonth;
    }

    // Render order summary with discount if coupon applied
    function renderOrderSummary() {
        orderSummary.innerHTML = "";
        let subtotal = 0;

        cart.forEach(item => {
            let qty = item.quantity || 1;
            let price = parseFloat(item.price);
            let itemTotal = qty * price;
            subtotal += itemTotal;

            orderSummary.innerHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2 order-item">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${item.image}" alt="${item.name}" width="36" height="36">
                        <span class="text-secondary-emphasis order-item-name">${item.name}</span>
                    </div>
                    <span class="fw-medium order-item-price">₹${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        let discount = subtotal * discountRate;
        let finalTotal = subtotal - discount;

        orderSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
        orderTotal.textContent = `₹${finalTotal.toFixed(2)}`;
    }

    // Apply coupon button click
    applyCouponBtn.addEventListener("click", () => {
        const code = couponInput.value.trim().toUpperCase();
        if (isValidCoupon(code)) {
            discountRate = 0.30; // 30% discount
            appliedCoupon = code;
            localStorage.setItem("appliedCoupon", appliedCoupon);
            couponMessage.innerHTML = "<p class=\"text-success\">Congratulations! you got 30% discount..</p>";
        } else {
            discountRate = 0;
            appliedCoupon = null;
            localStorage.removeItem("appliedCoupon");
            couponMessage.innerHTML = "<p class=\"text-danger\">Invalid coupon code.</p>";
        }
        renderOrderSummary();
    });

    // If a coupon was already applied in cart, load it
    if (appliedCoupon && isValidCoupon(appliedCoupon)) {
        discountRate = 0.30; // 30% discount
    }

    renderOrderSummary();

    // Store billing info in localStorage when placing order
    placeOrderBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submit refresh

        // Collect billing data
        const billingData = {
            firstName: document.getElementById("billingFirstName").value.trim(),
            companyName: document.getElementById("billingCompanyName").value.trim(),
            streetAddress: document.getElementById("billingStreetAddress").value.trim(),
            apartment: document.getElementById("billingApartment").value.trim(),
            city: document.getElementById("billingCity").value.trim(),
            phoneNumber: document.getElementById("billingPhoneNumber").value.trim(),
            email: document.getElementById("billingEmailAddress").value.trim(),
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || null // Get selected payment method
        };

        // Form validation check
        let isValid = true;

        if (!billingData.firstName) {
            showError("billingFirstName", "Please enter your first name.");
            isValid = false;
        } else {
            clearError("billingFirstName");
        }

        if (!billingData.streetAddress) {
            showError("billingStreetAddress", "Please enter your street address.");
            isValid = false;
        } else {
            clearError("billingStreetAddress");
        }

        if (!billingData.city) {
            showError("billingCity", "Please enter your city.");
            isValid = false;
        } else {
            clearError("billingCity");
        }

        if (!billingData.phoneNumber || !/^\d{10}$/.test(billingData.phoneNumber)) {
            showError("billingPhoneNumber", "Please enter a valid 10-digit phone number.");
            isValid = false;
        } else {
            clearError("billingPhoneNumber");
        }

        if (!billingData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.email)) {
            showError("billingEmailAddress", "Please enter a valid email address.");
            isValid = false;
        } else {
            clearError("billingEmailAddress");
        }

        if (!billingData.paymentMethod) {
            showError("paymentMethods", "Please select a payment method.");
            isValid = false;
        } else {
            clearError("paymentMethods");
        }

        if (!saveBillingInfoCheckbox.checked) {
            showError("saveBillingInfo", "Please check this box to save your billing information.");
            isValid = false;
        } else {
            clearError("saveBillingInfo");
        }

        if (!isValid) {
            return;
        }

        localStorage.setItem("billingInfo", JSON.stringify(billingData));

        alert("Order placed successfully!");
    });

    // Error handling functions (unchanged)
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        let errorElement = field.nextElementSibling;

        if (!errorElement || !errorElement.classList.contains("error-message")) {
            errorElement = document.createElement("div");
            errorElement.className = "error-message text-danger small";
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = field.nextElementSibling;

        if (errorElement && errorElement.classList.contains("error-message")) {
            errorElement.remove();
        }
    }
});
