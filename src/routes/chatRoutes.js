const express = require("express");
const chatRoutes = express.Router();

const sendMessage = require("../controllers/chatController");
const { getMainMenu } = require("../services/chatService");
const validateInput = require("../middleware/validateInput");

chatRoutes.get("/", (req, res) => {
  res.json({ message: getMainMenu() });
});

chatRoutes.post("/send-message", validateInput, sendMessage);

module.exports = chatRoutes;
