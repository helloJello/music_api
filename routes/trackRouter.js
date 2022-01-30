let express = require("express");
let router = express.Router();
let trackController = require("../controllers/trackController");
let authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware.authorize, trackController.addTrack);

module.exports = router;
