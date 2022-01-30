const HttpStatus = require("http-status-codes");
const Validator = require("../middleware/validator");
const music = require("../services/music");

exports.getIsrc = async (req, res) => {
  try {
    let isrc = req.query.isrc;

    //validate contract
    let contract = new Validator();
    contract.isRequired(isrc, "ISRC is required!");

    if (!contract.isValid()) {
      return res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .send({ error: contract.errors() })
        .end();
    }

    //search the track
    let track = await music.getTrackByIsrc(isrc);

    //if no track found
    if (!track) {
      return res
        .status(HttpStatus.StatusCodes.NOT_FOUND)
        .send({ error: contract.errors() })
        .end();
    } else {
      res.status(HttpStatus.StatusCodes.OK).send(track);
    }
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.getArtist = async (req, res) => {
  try {
    let title = req.query.title;

    //validate contract
    let contract = new Validator();
    contract.isRequired(title, "Track title is required!");

    if (!contract.isValid()) {
      return res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .send({ error: contract.errors() })
        .end();
    }

    let track = await music.getTrackByTitle(title);

    //if no track found
    if (!track) {
      return res
        .status(HttpStatus.StatusCodes.NOT_FOUND)
        .send({ error: contract.errors() })
        .end();
    } else {
      res.status(HttpStatus.StatusCodes.OK).send(track);
    }
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};
