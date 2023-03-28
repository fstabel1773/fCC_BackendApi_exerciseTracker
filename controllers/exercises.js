const User = require("../models/users");
const Exercise = require("../models/exercises");

const createExercise = async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    const user = await User.findById(_id, "username");

    const newExercise = await Exercise.create({
      userId: user._doc._id,
      username: user._doc.username,
      description,
      duration,
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).send({
      username: user._doc.username,
      description: newExercise._doc.description,
      duration: newExercise._doc.duration,
      date: newExercise._doc.date.toDateString(),
      _id: user._doc._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getExerciseLog = async (req, res) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;
    const logQuery = {
      userId: _id,
    };
    if (from && to) {
      logQuery.date = { $gte: from, $lte: to };
    } else if (from) {
      logQuery.date = { $gte: from };
    } else if (to) {
      logQuery.date = { $lte: to };
    }

    const log = (
      await Exercise.find(logQuery, "-_id description duration date").limit(
        limit ? limit : ""
      )
    ).map((exercise) => {
      return { ...exercise._doc, date: exercise.date.toDateString() };
    });

    return log;
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = { createExercise, getExerciseLog };
