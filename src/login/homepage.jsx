import React from 'react';

import Navbar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import {useRef, useEffect} from "react";

const Homepage = () => {
    const cardsRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.transform = "scale(1)";
                        entry.target.style.opacity = "1";
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.3
            }
        );

        const cards = cardsRef.current.querySelectorAll('.card');
        cards.forEach(card => {
            observer.observe(card);
        });

        return () => {
            cards.forEach(card => {
                observer.unobserve(card);
            });
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="jumbotron text-center bg-white">
                <h1 className="display-4">Video calls don&apos;t have to suck.</h1>
                <p className="lead">Get the tools you need to look your best in every video call.</p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg" href="/signup" role="button">Get Started</a>
                </p>
            </div>

            <section id="features" className="container" ref={cardsRef}>
                <ul className="row list-unstyled">
                    <li className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h3 className="card-title">Instant Meeting Transcripts</h3>
                                <p className="card-text">Keep track of everything that&apos;s said with automated, real-time transcription. After the meeting, you can review the transcript to recall important details, decisions, and action items.</p>
                            </div>
                        </div>
                    </li>
                    <li className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h3 className="card-title">Nothing to Install</h3>
                                <p className="card-text">Call Sidekick runs completely in your web browser. There&apos;s
                                    no plugins or programs to install!</p>
                            </div>
                        </div>
                    </li>
                    <li className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h3 className="card-title">Private and Secure</h3>
                                <p className="card-text">Your transcripts remain private. Transcripts will never be
                                    used for marketing or read by anyone other than you.</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
            <Footer />
        </>
    );
};

export default Homepage;