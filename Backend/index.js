const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const MONGO = process.env.MONGO_URL;
const frontEndUrl = process.env.frontend_url


app.use(
  cors({
    origin: [frontEndUrl],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
    credentials: true,
  })
);

mongoose.connect(MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Contact Search API is running");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});