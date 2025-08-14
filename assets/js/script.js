document.addEventListener("DOMContentLoaded", function () {
    var profileIcon = document.getElementById('profileIcon');
    var popover = new bootstrap.Popover(profileIcon, {
        trigger: 'click',
        placement: 'bottom'
    });

    // Optional: Close popover when clicking outside
    document.addEventListener('click', function (e) {
        if (!profileIcon.contains(e.target) && document.querySelector('.popover') && !document.querySelector('.popover').contains(e.target)) {
            popover.hide();
        }
    });
});


