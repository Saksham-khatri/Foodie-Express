const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const multer = require('multer');
const path = require('path');

// Setup for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // uploads folder me image save karna
  },
  filename: function (req, file, cb) {
    // filename me space ya duplicate avoid krne ke liye safer name
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// GET /api/foods - Fetch all foods or filter by category
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    const foods = await Food.find(query);

    const updatedFoods = foods.map(food => ({
      ...food.toObject(),
      image: `http://localhost:5000/uploads/${food.image}`,
    }));

    res.json(updatedFoods);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching foods',
      error: err.message,
    });
  }
});

// POST /api/foods - Add a new food item (form-data with image)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { foodName, price, category } = req.body;
    const image = req.file?.filename;

    if (!foodName || !price || !category || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newFood = new Food({
      foodName,
      price,
      image,
      category,
    });

    await newFood.save();

    res.status(201).json({
      message: 'Food added successfully',
      food: {
        ...newFood.toObject(),
        image: `http://localhost:5000/uploads/${newFood.image}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding food',
      error: error.message,
    });
  }
});

// PUT /api/foods/:id - Update food by ID (image optional)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const foodId = req.params.id;
    const { foodName, price, category } = req.body;
    const image = req.file?.filename;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    food.foodName = foodName || food.foodName;
    food.price = price || food.price;
    food.category = category || food.category;
    if (image) {
      food.image = image;
    }

    await food.save();

    res.json({
      message: 'Food updated successfully',
      food: {
        ...food.toObject(),
        image: `http://localhost:5000/uploads/${food.image}`,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error updating food',
      error: err.message,
    });
  }
});

// DELETE /api/foods/:id - Delete a food item by ID
router.delete('/:id', async (req, res) => {
  try {
    const foodId = req.params.id;
    await Food.findByIdAndDelete(foodId);
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    res.status(500).json({
      message: 'Error deleting food',
      error: err.message,
    });
  }
});

// GET /api/foods/categories - Get unique food categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Food.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching categories',
      error: err.message,
    });
  }
});

module.exports = router;
