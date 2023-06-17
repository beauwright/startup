function login() {
    const emailEl = document.querySelector("#email");
    const passwordEl = document.querySelector("#password");

    const email = emailEl.value;
    const password = passwordEl.value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
        .then(response => {
            if (response.ok) {
                // Redirect to the dashboard if login was successful
                window.location.href = "dashboard.html";
            } else {
                // Display an error message if login failed
                alert("Login failed. Please check your email and password and try again.");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const form = document.querySelector("#loginForm");
form.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from being submitted normally
    login();
});
