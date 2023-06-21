import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from "./login/homepage.jsx"
import Login from "./login/login.jsx"
import Signup from "./login/signup.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Homepage />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;