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

//edit birthday
router.put("/:id", async (req, res) => {
  const birthday = await Birthday.findOne({
    _id: req.params.id,
  });

  if (!birthday) {
    return res.status(201).send("Birthday does not exist");
  }

  try {
    await Birthday.findOneAndUpdate(
      {
        _id: birthday._id,
      },
      {
        $set: {
          person: req.body.person,
          date: req.body.date,
          category: req.body.category,
          status: req.body.status,
        },
      }
    );
    return res.status(200).send("Updated!");
  } catch (error) {
    console.log(error);
    return res.status(201).send("Unsuccessfull update");
  }
});
module.exports = router;
