import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <Link className="navbar-brand" to="/">
                <img className="navbar-pic" src="callsidekicklogo.png" alt="Call Sidekick Logo" width="30" height="30" />
                Call Sidekick
            </Link>
            <button onClick={toggle} className={`navbar-toggler ${isOpen ? "" : "collapsed"}`} type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup">Sign Up</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
