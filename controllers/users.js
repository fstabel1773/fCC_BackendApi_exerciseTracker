const User = require("../models/users");
const Exercise = require("../models/exercises");

const createUser = async (req, res) => {
  // add first step: check if user already exists
  const newUser = await User.create(req.body);
  return res.status(201).send(newUser);

  // error-handling?
};

const getUsers = async (req, res) => {
  // error-handling? -> try/catch?
  const users = await User.find({});
  return res.status(200).send(users);
};

const getSingleUser = async (req, res, next) => {
  const { _id } = req.params;
  let { from, to, limit } = req.query;

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

  try {
    const user = await User.findById(_id);
    const log = (
      await Exercise.find(logQuery, "-_id description duration date").limit(
        limit ? limit : ""
      )
    ).map((exercise) => {
      return { ...exercise._doc, date: exercise.date.toDateString() };
    });
    const count = log.length;

    return res.status(200).send({
      username: user.username,
      count,
      _id,
      log,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getUsers, getSingleUser };
