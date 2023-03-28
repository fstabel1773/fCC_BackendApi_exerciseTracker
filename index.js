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
