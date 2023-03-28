const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

/* ***************************
 * project-solution-code *****
 *****************************/
const connectDb = require("./db/connect");
const users = require("./routes/users");

// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

// routes
app.use("/api/users", users);

app.post("/api/users", async (req, res) => {
  // add first step: check if user already exists
  const newUser = await User.create(req.body);
  return res.status(201).send(newUser);

  // error-handling?
});

app.get("/api/users", async (req, res) => {
  // error-handling? -> try/catch?
  const users = await User.find({});
  return res.status(200).send(users);
});

app.post("/api/users/:_id/exercises", async (req, res, next) => {
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
});

app.get("/api/users/:_id/logs", async (req, res, next) => {
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
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI2);
    app.listen(port, () => {
      console.log(`Your app is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
