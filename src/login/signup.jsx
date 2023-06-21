import React, { useState } from "react";
import PropTypes from "prop-types";

import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import {Link} from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const signup = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password }),
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/dashboard.html";
                } else {
                    alert("Signup failed. Please check your details and try again or login if you've already created an account.");
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
                <h1 className="display-4 fadeIn">Join us today!</h1>
                <p className="lead fadeIn">Please enter your details to create an account.</p>
            </div>
            <SignupForm
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                signup={signup}
            />
            <Footer />
        </>
    );
}

function SignupForm({firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, signup}) {
    return (
        <section id="signup" className="container mt-5">
            <form id="signupForm" onSubmit={signup}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
            <Link to="/login">
                <button className="btn btn-secondary" >Login Instead</button>
            </Link>
        </section>
    );
}

SignupForm.propTypes = {
    firstName: PropTypes.string.isRequired,
    setFirstName: PropTypes.func.isRequired,
    lastName: PropTypes.string.isRequired,
    setLastName: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    setConfirmPassword: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired,
};

export default Signup;
