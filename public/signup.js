function signup() {
    const emailEl = document.querySelector("#email");
    const passwordEl = document.querySelector("#password");
    const confirm_passwordEl = document.querySelector("#confirm_password");
    const firstNameEl = document.querySelector("#firstName");
    const lastNameEl = document.querySelector("#lastName");

    const firstName = firstNameEl.value;
    const lastName = lastNameEl.value;
    const email = emailEl.value;
    const password = passwordEl.value;
    const confirm_password = confirm_passwordEl.value;

    // Check if the passwords match
    if (password !== confirm_password) {
        alert("Passwords do not match!");
        return;
    }

    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password }),
    })
        .then(response => {
            if (response.ok) {
                // Redirect to the dashboard if signup was successful
                window.location.href = "dashboard.html";
            } else {
                // Display an error message if signup failed
                alert("Signup failed. Please check your details and try again.");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Add an event listener to the form
const form = document.querySelector("#signupForm");
form.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from being submitted normally
    signup();
});
