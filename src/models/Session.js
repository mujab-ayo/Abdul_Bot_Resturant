const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  currentState: {
    type: String,
    required: true,
    default: "MAIN_MENU",
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
    },
  
});

module.exports = mongoose.model("Session", sessionSchema);
