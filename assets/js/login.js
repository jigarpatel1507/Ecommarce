document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password,
            expiresInMins: 30
        }),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Invalid username or password");
            }
            return res.json();
        })
        .then(data => {
            console.log("Login successful:", data);
            // Save token
            localStorage.setItem("token", data.token);
            // Redirect to home page
            window.location.href = "pages/home.html";
        })
        .catch(err => {
            alert(err.message);
            console.error("Login error:", err);
        });
});