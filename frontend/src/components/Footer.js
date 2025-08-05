import React from 'react';
import '../styles/Footer.css';

function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-brand">© 2025 Foodie Express. All rights reserved.</p>

        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Support</a>
          <a href="#">Contact</a>
        </div>

        <div className="newsletter">
          <p>Subscribe for updates:</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

       
        <button className="back-to-top" onClick={handleBackToTop}>
          ↑ Back to Top
        </button>
      </div>
    </footer>
  );
}

export default Footer;
