document.addEventListener("DOMContentLoaded", () => {
    const orderSummary = document.getElementById("orderSummary");
    const orderSubtotal = document.getElementById("orderSubtotal");
    const orderTotal = document.getElementById("orderTotal");
    const placeOrderBtn = document.getElementById("placeOrderBtn");

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
});

//store the form data to localStorage
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("checkoutForm");
    const saveBillingInfo = document.getElementById("saveBillingInfo");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submit

        // Validate the form
        if (!form.checkValidity()) {
            form.reportValidity(); // Show browser's validation messages
            return;
        }

        // Collect data
        const billingDetails = {
            firstName: document.getElementById("billingFirstName").value.trim(),
            companyName: document.getElementById("billingCompanyName").value.trim(),
            streetAddress: document.getElementById("billingStreetAddress").value.trim(),
            apartment: document.getElementById("billingApartment").value.trim(),
            city: document.getElementById("billingCity").value.trim(),
            phoneNumber: document.getElementById("billingPhoneNumber").value.trim(),
            emailAddress: document.getElementById("billingEmailAddress").value.trim()
        };

        // Store in localStorage only if checkbox is checked
        if (saveBillingInfo.checked) {
            localStorage.setItem("billingDetails", JSON.stringify(billingDetails));
            console.log("Billing details saved to localStorage:", billingDetails);
        } else {
            localStorage.removeItem("billingDetails"); // Remove if not saving
            console.log("Billing details not saved (checkbox unchecked).");
        }

        // Redirect or show success message
        alert("Order placed successfully!");
        // window.location.href = "success.html"; // Example redirect
    });
});


