function login() {
    const nameEl = document.querySelector("#email");
    localStorage.setItem("email", nameEl.value);
}