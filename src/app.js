const express = require("express");
const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

const cookieParser = require("cookie-parser");

const attachSession = require("./middleware/session");
const chatRoutes = require("./routes/chatRoutes");


app.use(express.json());
app.use(cookieParser());
app.use(attachSession);


app.use("/api/chat", chatRoutes);

module.exports = app;
