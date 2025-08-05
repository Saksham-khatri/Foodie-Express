import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/HomePage.css'; // reuse HomePage styles
import FoodCard from '../components/FoodCard';

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/wishlist', {
          params: { userId: user._id },
        });
        setWishlistItems(res.data.wishlist);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    };

    if (user) fetchWishlist();
  }, [user]);

  return (
    <div className="home-container">
      <h2 className="section-title">My Wishlist</h2>
      <div className="food-grid">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => <FoodCard key={item._id} item={item} />)
        ) : (
          <p>No items in wishlist.</p>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
