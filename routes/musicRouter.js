let express = require("express");
let router = express.Router();
let musicController = require("../controllers/musicController");

router.get("/artist", musicController.getArtist);
router.get("/isrc", musicController.getIsrc);

module.exports = router;
