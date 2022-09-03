const express = require("express");
const dotenv = require("dotenv");

const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// security middleware import

const cors = require("cors");

// router import
const userRouter = require("./src/routes/userRouter");


//
const app = express();
dotenv.config();
app.use(express.json());

// security middleware implement

app.use(cors());

// databse connection
mongoose
  .connect(process.env.DATABASE_URL ||5000, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection seccessful !"))
  .catch((err) => console.log("Databse connection faild!"));

// routing

app.use("/user", userRouter);

// undefined route
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found!",
  });
});

// default error handler
// default error handler

const errorHandler = (err, req, res, next) => {
  if (res.headerssent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

// server listen

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});