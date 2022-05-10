const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const birthdayRoute = require("./routes/birthday");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {}, (err) => {
  if (err) console.log(err);
  else console.log("MongoDB is connected");
});
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  return next();
});

// middleware
app.use(express.json());

// routes
app.use(birthdayRoute);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
