import React, { useState, useEffect } from 'react';
import './components.css';

export default function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <nav className="navbar">
            <div className="nav-left">AI CV Tool</div>
            <div className="nav-right">
                
                <label className="switch" aria-label="Toggle Dark Mode">
                    <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
                    <span className="slider"></span>
                </label>
                
            </div>
        </nav>
    );
}