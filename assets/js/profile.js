document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You are not logged in. Redirecting to login page...");
        window.location.href = "index.html";
        return;
    }

    // Fetch user profile data
    fetch("https://dummyjson.com/users/1", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch user profile");
            return res.json();
        })
        .then(data => {
            // Populate form
            document.getElementById("firstName").value = data.firstName || "";
            document.getElementById("lastName").value = data.lastName || "";
            document.getElementById("email").value = data.email || "";

            const address = data.address || {};
            document.getElementById("address").value = address.street || "";
            document.getElementById("country").value = address.country || "";
            document.getElementById("state").value = address.state || "";
            document.getElementById("city").value = address.city || "";

            document.getElementById("mobileNumber").value = data.phone || "";

            const gender = data.gender || "";
            if (gender.toLowerCase() === "male") {
                document.getElementById("male").checked = true;
            } else if (gender.toLowerCase() === "female") {
                document.getElementById("female").checked = true;
            }
        })
        .catch(err => {
            alert(err.message);
            console.error("Error fetching profile data:", err);
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById("profile");
    const passwordMessage = document.getElementById("passwordMessage");

    function showMessage(message, type = "error") {
        passwordMessage.textContent = message;
        passwordMessage.className = `small mt-2 ${type === "success" ? "text-success" : "text-danger"}`;
    }

    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const currentPassword = document.querySelector('input[placeholder="Current Password"]').value.trim();
        const newPassword = document.querySelector('input[placeholder="New Password"]').value.trim();
        const confirmPassword = document.querySelector('input[placeholder="Confirm New Password"]').value.trim();

        // Validate password fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage("Please fill in all password fields.");
            return;
        }
        if (newPassword.length < 6) {
            showMessage("New password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            showMessage("New password and confirmation do not match.");
            return;
        }
        if (currentPassword !== "oldPassword123") {
            showMessage("Current password is incorrect.");
            return;
        }

        // Collect all profile data
        const profileData = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim(),
            address: {
                street: document.getElementById("address").value.trim(),
                country: document.getElementById("country").value.trim(),
                state: document.getElementById("state").value.trim(),
                city: document.getElementById("city").value.trim()
            },
            phone: document.getElementById("mobileNumber").value.trim(),
            gender: document.querySelector('input[name="gender"]:checked')?.value || "",
            password: newPassword // Save updated password
        };

        // Store in localStorage
        localStorage.setItem("userProfile", JSON.stringify(profileData));

        // Update on server (demo API)
        fetch("https://dummyjson.com/users/1", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(profileData)
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to update profile.");
            return res.json();
        })
        .then(() => {
            showMessage("Profile updated and stored locally!", "success");
            profileForm.reset();
        })
        .catch(err => {
            showMessage(err.message);
            console.error(err);
        });
    });
});
