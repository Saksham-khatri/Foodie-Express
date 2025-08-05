import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminFoodsPage.css';

function AdminFoodsPage() {
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [category, setCategory] = useState('');
  const [foods, setFoods] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token !== 'admin-token') {
      navigate('/admin-login');
    } else {
      fetchFoods();
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !price || !category) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('foodName', foodName);
    formData.append('price', price);
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/foods/${editId}`, formData);
        alert('Food updated');
      } else {
        if (!image) {
          alert('Please select an image');
          return;
        }
        await axios.post('http://localhost:5000/api/admin/add-food', formData);
        alert('Food added');
      }

      setFoodName('');
      setPrice('');
      setCategory('');
      setImage(null);
      setPreview('');
      setEditId(null);
      fetchFoods();
    } catch (err) {
      console.error('Error submitting food:', err.message);
      alert('Something went wrong');
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/foods/');
      setFoods(res.data);
    } catch (err) {
      console.error('Error fetching foods:', err.message);
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Are you sure to delete?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error('Error deleting food:', err.message);
    }
  };

  const handleEditFood = (food) => {
    setFoodName(food.foodName);
    setPrice(food.price);
    setCategory(food.category);
    setEditId(food._id);
    setImage(null);

    // If image path already present, make full path for preview
    if (food.image && !food.image.startsWith('data:')) {
      setPreview(`http://localhost:5000${food.image}`);
    } else {
      setPreview('');
    }
  };

  return (
    <div className="admin-foods-container">
      <h2>{editId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
      
      <form className="admin-foods-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Food Name:</label>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Image:</label>
        <input type="file" onChange={handleImageChange} />
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Momos">Momos</option>
          <option value="Pizza">Pizza</option>
          <option value="Paneer">Paneer</option>
          <option value="Chaap">Chaap</option>
          <option value="Beverages">Beverages</option>
          <option value="Others">Others</option>
        </select>

        <button type="submit">{editId ? 'Update Food' : 'Add Food'}</button>
      </form>

      <h3>All Foods</h3>
      <div className="foods-list">
        {foods.length === 0 ? (
          <p>No foods found</p>
        ) : (
          foods.map((food) => (
            <div key={food._id} className="food-card">
              <p><strong>Name:</strong> {food.foodName}</p>
              <p><strong>Price:</strong> ₹{food.price}</p>
              <p><strong>Category:</strong> {food.category}</p>
              <img
               src={food.image.startsWith('http') ? food.image : `http://localhost:5000${food.image}`}
               alt={food.foodName}
              />

              <div className="food-actions">
                <button onClick={() => handleEditFood(food)}>Edit</button>
                <button onClick={() => handleDeleteFood(food._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminFoodsPage;
