const Food = require('../models/food');

async function addFood(data) {
  const food = new Food(data);
  return await food.save();
}

async function listFoods() {
  return await Food.find();
}

async function deleteFood(foodId) {
  return await Food.deleteOne({ foodId });
}

module.exports = {
  addFood,
  listFoods,
  deleteFood
};
