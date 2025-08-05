import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import FoodCard from '../components/FoodCard';
import '../styles/HomePage.css';

function HomePage() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { cartItems } = useContext(CartContext);

  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || '';

  const bannerData = [
    {
      img: "banner.jpg",
      title: "Flat 30% Off",
      subtitle: "On all fast food orders today!"
    },
    {
      img: "banner1.jpg",
      title: "New Launches",
      subtitle: "Try our brand new dessert range"
    },
    {
      img: "banner2.jpg",
      title: "Top Rated Meals",
      subtitle: "Loved by 10,000+ customers"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await axios.get('http://localhost:5000/api/foods');
        setFoods(res.data);
      } catch (err) {
        console.error('Error fetching foods:', err.message);
      }
    }
    fetchFoods();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get('http://localhost:5000/api/foods/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
      }
    }
    fetchCategories();
  }, []);

  const filteredBySearch = foods.filter((food) =>
    food.foodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByPrice = filteredBySearch.filter((food) => {
    if (priceFilter === 'all') return true;
    if (priceFilter === '0-100') return food.price <= 100;
    if (priceFilter === '100-200') return food.price > 100 && food.price <= 200;
    if (priceFilter === '200+') return food.price > 200;
    return true;
  });

  const filteredFoods = filteredByPrice.filter((food) => {
    if (categoryFilter === 'all') return true;
    return food.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  // Sort categories to show 'Others' at the end
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.toLowerCase() === 'others') return 1;
    if (b.toLowerCase() === 'others') return -1;
    return 0;
  });

  return (
    <div className="homepage-container">
      {userName && <p className="welcome-text">Welcome, {userName} 👋</p>}

      {/* Banner */}
      <div className="banner">
        <img
          src={bannerData[currentSlide].img}
          alt="Food Banner"
          className="banner-image fade-in"
        />
        <div className="banner-text">
          <h1>{bannerData[currentSlide].title}</h1>
          <p>{bannerData[currentSlide].subtitle}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="0-100">₹0–₹100</option>
          <option value="100-200">₹100–₹200</option>
          <option value="200+">₹200+</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Cart Count */}
      <p className="cart-info">
        Items in Cart: <strong>{cartItems.length}</strong>
      </p>

      {/* Food Section UI */}
      {searchTerm || categoryFilter !== 'all' || priceFilter !== 'all' ? (
        <div className="food-grid">
          {filteredFoods.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '18px', color: '#888' }}>
              No food items found. Try a different filter or search.
            </p>
          ) : (
            filteredFoods.map((food) => (
              <div className="food-card" key={food._id}>
                <FoodCard item={food} />
              </div>
            ))
          )}
        </div>
      ) : (
        sortedCategories.map((cat) => {
          const items = foods.filter((food) => food.category.toLowerCase() === cat.toLowerCase());
          if (items.length === 0) return null;
          return (
            <div key={cat} className="category-section">
              <h2 className="category-title">{cat}</h2>
              <div className="food-grid">
                {items.map((food) => (
                  <div className="food-card" key={food._id}>
                    <FoodCard item={food} />
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default HomePage;
