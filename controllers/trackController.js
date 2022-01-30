const HttpStatus = require("http-status-codes");
const Validator = require("../middleware/validator");
const music = require("../services/music");

exports.addTrack = async (req, res) => {
  let { isrc } = req.body;

  //validate contract
  let contract = new Validator();
  contract.isRequired(isrc, "ISRC is required!");

  if (!contract.isValid()) {
    return res
      .status(HttpStatus.StatusCodes.BAD_REQUEST)
      .send({ error: contract.errors() })
      .end();
  }

  try {
    //Search the Spotify API
    let spotifyTrack = await music.getSpotifyTrack(isrc);

    //if no track found in spotify
    if (!spotifyTrack) {
      return res
        .status(HttpStatus.StatusCodes.NOT_FOUND)
        .send({
          error: "Track not found"
        })
        .end();
    }

    //check if the track is already in the database
    let trackExists = await music.trackExistsInCatalog(isrc);

    if (trackExists) {
      return res
        .status(HttpStatus.StatusCodes.CONFLICT)
        .send({
          error: "Track already exists"
        })
        .end();
    }

    // popularity check
    let popularTrack = await music.rankTrackByPopularity(spotifyTrack);

    // get or crate the artist
    let artistId = await music.getArtistId(popularTrack.album.artists[0].name);

    // if the track doesn't exist in the database then create it
    let track = await music.createTrack(isrc, artistId, popularTrack);

    res.status(HttpStatus.StatusCodes.CREATED).send(track).end();
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};
