document.addEventListener("DOMContentLoaded", () => {
    const orderSummary = document.getElementById("orderSummary");
    const orderSubtotal = document.getElementById("orderSubtotal");
    const orderTotal = document.getElementById("orderTotal");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const saveBillingInfoCheckbox = document.getElementById("saveBillingInfo");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
                    <span class="fw-medium order-item-price">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        orderTotal.textContent = `$${subtotal.toFixed(2)}`;
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

        // Validate each field and show error messages
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

        // If validation fails, stop further execution
        if (!isValid) {
            return;
        }

        // Store billing data in localStorage
        localStorage.setItem("billingInfo", JSON.stringify(billingData));

        alert("Order placed successfully!");
    });

    // Function to show error messages
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        let errorElement = field.nextElementSibling;

        // Check if an error message already exists
        if (!errorElement || !errorElement.classList.contains("error-message")) {
            errorElement = document.createElement("div");
            errorElement.className = "error-message text-danger small";
            field.parentNode.appendChild(errorElement);
        }

        // Update the error message text
        errorElement.textContent = message;
    }

    // Function to clear error messages
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = field.nextElementSibling;

        // Remove the error message if it exists
        if (errorElement && errorElement.classList.contains("error-message")) {
            errorElement.remove();
        }
    }
});
