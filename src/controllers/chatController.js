const { processInputedNumber } = require("../services/chatService");

async function sendMessage(req, res, next) {
  try {
    const userInput = req.body.message;

    if (!userInput || userInput === "") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const response = await processInputedNumber(userInput, req.sessionData);

    return res.json(response );
  } catch (err) {
    return next(err);
  }
}

module.exports = sendMessage;
