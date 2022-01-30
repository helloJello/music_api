require("dotenv").config();
var express = require("express");
let app = express();
let cors = require("cors");
let debug = require("debug")("bare-api:server");
let indexRouter = require("./routes/indexRouter");
const HttpStatus = require("http-status-codes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.use((req, res, next) => {
  res
    .status(HttpStatus.StatusCodes.NOT_FOUND)
    .send({ error: "Page not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: "Oops we did it again!" });
});

app.listen(3005, () => {
  console.log("🚀 Server running on port 3005 🚀");
});
