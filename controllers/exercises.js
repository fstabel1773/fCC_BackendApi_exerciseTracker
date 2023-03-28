const User = require("../models/users");
const Exercise = require("../models/exercises");

const createExercise = async (req, res, next) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(_id, "username");

    const newExercise = await Exercise.create({
      userId: user._doc._id,
      username: user._doc.username,
      description,
      duration,
      date: date ? new Date(date) : new Date(),
    });

    // return res.status(201).send({ ...user._doc, ...newExercise._doc });
    return res.status(201).send({
      username: user._doc.username,
      description: newExercise._doc.description,
      duration: newExercise._doc.duration,
      date: newExercise._doc.date.toDateString(),
      _id: user._doc._id,
    });

    // .exec(err, data) => { if (err) { return console.error(err)}; return data} ???
  } catch (error) {
    next(error);
  }
};

module.exports = { createExercise };
