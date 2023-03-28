const express = require("express");
const router = express.Router();

const { createUser, getUsers, getSingleUser } = require("../controllers/users");
const { createExercise } = require("../controllers/exercises");

router.route("/").get(getUsers).post(createUser);
router.route("/:_id/exercises").post(createExercise);
router.route("/:_id/logs").get(getSingleUser);

module.exports = router;
