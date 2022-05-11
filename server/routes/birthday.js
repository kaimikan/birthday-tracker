const express = require("express");
const Birthday = require("../models/birthday");

const router = express.Router();

//add birthday
router.post("/", async (req, res) => {
  console.log("we ebter");
  console.log(req.body.person);
  const birthday = new Birthday({
    person: req.body.person,
    date: new Date(req.body.date), //req.body.date,
    // family/friend/etc.
    category: req.body.category,
    // 0 - unwished, 1 - wished
    status: req.body.status,
  });
  await birthday
    .save()
    .then(() => res.status(200).send(birthday))
    .catch((err) => res.status(400).send(err));
});

//delete birthday
router.delete("/:id", async (req, res) => {
  const birthday = await Birthday.findOneAndDelete({
    _id: req.params.id,
  })
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(500).send(err));
});

//get birthdays
router.get("/", async (req, res) => {
  const birthdays = await Birthday.find()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
