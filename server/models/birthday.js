const { Schema, model } = require("mongoose");

const birthdaySchema = new Schema({
  person: {
    type: String,
  },
  date: {
    type: Date,
  },
  category: {
    type: String,
  },
  status: {
    type: Number,
  },
});

module.exports = model("Birthday", birthdaySchema);
