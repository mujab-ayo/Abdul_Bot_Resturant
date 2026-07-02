const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    },
  menuIndex: {
    type: Number,
      required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Main Dish", "Side", "Drink"],
  },
  price: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('MenuItem', menuSchema);