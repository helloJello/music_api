let express = require("express");
let router = express.Router();
let trackRouter = require("./trackRouter");
let musicRouter = require("./musicRouter");
let userRouter = require("./userRouter");

router.use("/api/v1/tracks", trackRouter);
router.use("/api/v1/music", musicRouter);
router.use("/api/v1/users", userRouter);

module.exports = router;
