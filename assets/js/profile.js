// Toggle this to true in production if you want to force login
const REQUIRE_LOGIN = false;

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (REQUIRE_LOGIN && !token) {
    alert("You are not logged in. Redirecting to login page...");
    window.location.href = "index.html";
    return;
  }

  const form = document.getElementById("profile");
  const formMessage = document.getElementById("formMessage");
  const cancelBtn = document.getElementById("cancelBtn");

  // Inputs
  const firstName = document.getElementById("firstName");
  const lastName  = document.getElementById("lastName");
  const email     = document.getElementById("email");
  const address   = document.getElementById("address");
  const country   = document.getElementById("country");
  const state     = document.getElementById("state");
  const city      = document.getElementById("city");
  const mobile    = document.getElementById("mobileNumber");
  const currentPassword = document.getElementById("currentPassword");
  const newPassword     = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  // Error spans
  const errors = {
    firstName: document.getElementById("firstNameError"),
    lastName : document.getElementById("lastNameError"),
    email    : document.getElementById("emailError"),
    gender   : document.getElementById("genderError"),
    country  : document.getElementById("countryError"),
    state    : document.getElementById("stateError"),
    city     : document.getElementById("cityError"),
    mobile   : document.getElementById("mobileError"),
    currentPassword: document.getElementById("currentPasswordError"),
    newPassword    : document.getElementById("newPasswordError"),
    confirmPassword: document.getElementById("confirmPasswordError"),
  };

  function setError(inputEl, spanEl, message) {
    spanEl.textContent = message || "";
    if (message) {
      inputEl?.classList.add("is-invalid");
    } else {
      inputEl?.classList.remove("is-invalid");
    }
  }

  function clearAllErrors() {
    Object.values(errors).forEach(s => s.textContent = "");
    [
      firstName, lastName, email, country, state, city, mobile,
      currentPassword, newPassword, confirmPassword
    ].forEach(el => el.classList.remove("is-invalid"));
  }

  function showFormMessage(msg, type = "success") {
    formMessage.classList.remove("d-none", "alert-success", "alert-danger");
    formMessage.classList.add(type === "success" ? "alert-success" : "alert-danger");
    formMessage.textContent = msg;
  }

  // Fetch user profile (best-effort; won’t block the form)
  fetch("https://dummyjson.com/users/1", {
    method: "GET",
    headers: token ? { "Authorization": `Bearer ${token}` } : {}
  })
  .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch user profile")))
  .then(data => {
    firstName.value = data.firstName || "";
    lastName.value  = data.lastName  || "";
    email.value     = data.email     || "";
    const addr = data.address || {};
    address.value   = addr.street || "";
    country.value   = addr.country || "";
    state.value     = addr.state   || "";
    city.value      = addr.city    || "";
    mobile.value    = (data.phone || "").replace(/\D/g, "").slice(0,10);

    const gender = (data.gender || "").toLowerCase();
    if (gender === "male") document.getElementById("male").checked = true;
    if (gender === "female") document.getElementById("female").checked = true;
  })
  .catch(err => {
    console.warn("Profile fetch skipped/failed:", err.message);
  });

  // Real-time validation helpers
  const validateFirst = () => {
    const v = firstName.value.trim();
    setError(firstName, errors.firstName, v ? "" : "First name is required.");
    return !!v;
  };
  const validateLast = () => {
    const v = lastName.value.trim();
    setError(lastName, errors.lastName, v ? "" : "Last name is required.");
    return !!v;
  };
  const validateEmail = () => {
    const v = email.value.trim();
    if (!v) { setError(email, errors.email, "Email is required."); return false; }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    setError(email, errors.email, ok ? "" : "Enter a valid email.");
    return ok;
  };
  const validateGender = () => {
    const checked = document.querySelector('input[name="gender"]:checked');
    errors.gender.textContent = checked ? "" : "Please select gender.";
    return !!checked;
  };
  const validateCountry = () => {
    const v = country.value.trim();
    setError(country, errors.country, v ? "" : "Country is required.");
    return !!v;
  };
  const validateState = () => {
    const v = state.value.trim();
    setError(state, errors.state, v ? "" : "State is required.");
    return !!v;
  };
  const validateCity = () => {
    const v = city.value.trim();
    setError(city, errors.city, v ? "" : "City is required.");
    return !!v;
  };
  const validateMobile = () => {
    const v = mobile.value.trim();
    const ok = /^[0-9]{10}$/.test(v);
    setError(mobile, errors.mobile, ok ? "" : "Enter a valid 10-digit number.");
    return ok;
  };
  const validatePasswords = () => {
    let ok = true;
    const cur = currentPassword.value.trim();
    const npw = newPassword.value.trim();
    const cpw = confirmPassword.value.trim();

    if (!cur) { setError(currentPassword, errors.currentPassword, "Enter your current password."); ok = false; }
    else if (cur !== "oldPassword123") { setError(currentPassword, errors.currentPassword, "Current password is incorrect."); ok = false; }
    else setError(currentPassword, errors.currentPassword, "");

    if (!npw) { setError(newPassword, errors.newPassword, "Enter a new password."); ok = false; }
    else if (npw.length < 6) { setError(newPassword, errors.newPassword, "Password must be at least 6 characters."); ok = false; }
    else setError(newPassword, errors.newPassword, "");

    if (!cpw) { setError(confirmPassword, errors.confirmPassword, "Confirm your new password."); ok = false; }
    else if (npw !== cpw) { setError(confirmPassword, errors.confirmPassword, "Passwords do not match."); ok = false; }
    else setError(confirmPassword, errors.confirmPassword, "");

    return ok;
  };

  // Attach real-time validation
  firstName.addEventListener("blur", validateFirst);
  lastName.addEventListener("blur", validateLast);
  email.addEventListener("blur", validateEmail);
  country.addEventListener("blur", validateCountry);
  state.addEventListener("blur", validateState);
  city.addEventListener("blur", validateCity);
  mobile.addEventListener("input", () => {
    // keep only digits
    mobile.value = mobile.value.replace(/\D/g, "").slice(0,10);
  });
  mobile.addEventListener("blur", validateMobile);
  document.getElementById("male").addEventListener("change", validateGender);
  document.getElementById("female").addEventListener("change", validateGender);

  // Cancel resets form + errors
  cancelBtn.addEventListener("click", () => {
    form.reset();
    clearAllErrors();
    formMessage.classList.add("d-none");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrors();
    formMessage.classList.add("d-none");

    // Run all validations
    const ok =
      validateFirst() &
      validateLast() &
      validateEmail() &
      validateGender() &
      validateCountry() &
      validateState() &
      validateCity() &
      validateMobile() &
      validatePasswords();

    if (!ok) {
      showFormMessage("Please fix the highlighted fields.", "danger");
      return;
    }

    // Collect data
    const profileData = {
      firstName: firstName.value.trim(),
      lastName : lastName.value.trim(),
      email    : email.value.trim(),
      address  : {
        street : address.value.trim(),
        country: country.value.trim(),
        state  : state.value.trim(),
        city   : city.value.trim()
      },
      phone : mobile.value.trim(),
      gender: document.querySelector('input[name="gender"]:checked')?.value || "",
      password: newPassword.value.trim(),
      interests: ["gaming","mobile","laptop"].filter(id => document.getElementById(id).checked)
    };

    // Save locally
    localStorage.setItem("userProfile", JSON.stringify(profileData));

    // Try server update (non-blocking for success state)
    fetch("https://dummyjson.com/users/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("token") ? { "Authorization": `Bearer ${localStorage.getItem("token")}` } : {})
      },
      body: JSON.stringify(profileData)
    })
    .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to update profile on server.")))
    .then(() => {
      showFormMessage("Profile updated successfully!", "success");
      // Keep values so user sees what they saved; remove below line if you prefer reset
      // form.reset(); 
    })
    .catch(err => {
      console.warn(err.message);
      showFormMessage("Profile saved locally. Server update failed (demo).", "danger");
    });
  });
});
