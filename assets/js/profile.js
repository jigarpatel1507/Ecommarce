document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You are not logged in. Redirecting to login page...");
        window.location.href = "index.html"; // Redirect to login page
        return;
    }

    // Fetch user profile data
    fetch("https://dummyjson.com/users/1", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
        },
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch user profile");
            }
            return res.json();
        })
        .then(data => {

            // Populate profile fields
            document.getElementById("firstName").value = data.firstName || "";
            document.getElementById("lastName").value = data.lastName || "";
            document.getElementById("email").value = data.email || "";

            // Handle address object
            const address = data.address || {};
            document.getElementById("address").value = address.street || ""; // Assuming 'street' is part of the address object
            document.getElementById("country").value = address.country || "";
            document.getElementById("state").value = address.state || "";
            document.getElementById("city").value = address.city || "";

            document.getElementById("mobileNumber").value = data.phone || "";

            // Handle gender
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