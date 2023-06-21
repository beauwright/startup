import React, { useState } from "react";
import PropTypes from "prop-types";

import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import {Link} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = (event) => {
        event.preventDefault();

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/dashboard.html";
                } else {
                    alert("Login failed. Please check your email and password and try again.");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <Navbar />
            <div className="jumbotron text-center bg-white">
                <h1 className="display-4 fadeIn">You're on your way to better video calls.</h1>
                <p className="lead fadeIn">We just need a few details.</p>
            </div>
            <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                login={login}
            />
            <Footer />
        </>
    );
}

function LoginForm({email, setEmail, password, setPassword, login}) {
    return (
        <section id="login" className="container mt-5">
            <form id="loginForm" onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <Link to="/signup">
                <button className="btn btn-secondary" >Sign Up Instead</button>
            </Link>
        </section>
    );
}

LoginForm.propTypes = {
    email: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
};

export default Login;
