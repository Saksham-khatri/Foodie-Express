// src/components/Banner.js

import React from 'react';
import '../styles/Banner.css';

function Banner() {
  return (
    <div className="banner-container">
      <img
        src="/banner.jpg" // image path
        alt="Foodie Express Banner"
        className="banner-image"
      />
      <div className="banner-text">
        <h1>Welcome to Foodie Express</h1>
        <p>Your favorite food, delivered fast & fresh!</p>
      </div>
    </div>
  );
}

export default Banner;
