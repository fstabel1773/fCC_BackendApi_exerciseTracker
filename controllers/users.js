const User = require("../models/users");
const { getExerciseLog } = require("./exercises");

const createUser = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(400).json({
        msg: "Error. Username allready exists. Please choose other name.",
      });
    }
    const newUser = await User.create(req.body);
    return res.status(201).send(newUser);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { _id } = req.params;

    const user = await User.findById(_id);
    const log = await getExerciseLog(req, res);
    const count = log.length;

    return res.status(200).send({
      username: user.username,
      count,
      _id,
      log,
    });
  } catch (error) {
    res.status(500).json({ msg: error, err: "someting wrong" });
  }
};

module.exports = { createUser, getUsers, getSingleUser };
