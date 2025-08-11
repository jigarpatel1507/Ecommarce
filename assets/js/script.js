// fetch the Header file
fetch("component/header.html").then(response => response.text()).then(data => {
    document.getElementById("header").innerHTML = data;
}).catch(err => console.log("Error in Loading header..", err));

// fetch the Footer file
fetch("component/footer.html").then(response => response.text()).then(data => {
    document.getElementById("footer").innerHTML = data;
}).catch(err => console.log("Error for Loading footer..", err));

// fetch login page

// fetch("pages/login.html").then(response => response.text()).then(data => {
//     document.getElementById('login').innerHTML = data;
// }).catch(err => console.log("Error for Loading login-page..", err));

//fetch home page
// fetch("pages/home.html").then(response => response.text()).then(data => {
//     document.getElementById("home").innerHTML = data;
// }).catch(err => console.log("Error for Loading home page..", err));

//fetch wishlist
// fetch("pages/wish-list.html").then(response => response.text()).then(data => {
//     document.getElementById("wishlist").innerHTML = data;
// }).catch(err => console.log("Error for Loading wishlist page..", err));

//fetch cart page
// fetch("pages/cart.html").then(response => response.text()).then(data => {
//     document.getElementById("cart").innerHTML = data;
// }).catch(err => console.log("Error for Loading cart page..", err));

//checkout page
fetch("pages/checkout.html").then(response => response.text()).then(data => {
    document.getElementById("checkout").innerHTML = data;
}).catch(err => console.log("Error for Loading checkout page..", err));