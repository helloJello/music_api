let SpotifyWebApi = require("spotify-web-api-node");
const { Op, QueryTypes } = require("sequelize");
const sequelize = require("sequelize");
const { Artist, Track } = require("../models/index");

exports.getSpotifyTrack = async (isrc) => {
  let spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });

  //grant the client credentials
  let access = await spotifyApi.clientCredentialsGrant();

  //set the access token
  spotifyApi.setAccessToken(access.body["access_token"]);

  //perform the search
  let data = await spotifyApi.searchTracks(`isrc:${isrc}`);

  //check if the track exists
  let spotifyTrack = data.body;

  return spotifyTrack;
};

exports.rankTrackByPopularity = async (allTracks) => {
  // check if there is more than one track and sort by popularity
  if (allTracks.tracks.items.length > 1) {
    spotifyTrack = allTracks.tracks.items.sort(
      (a, b) => b.popularity - a.popularity
    )[0];
  } else {
    spotifyTrack = allTracks.tracks.items[0];
  }

  return spotifyTrack;
};

exports.trackExistsInCatalog = async (isrc) => {
  let trackExists = await Track.findOne({ where: { isrc } });

  return trackExists;
};

exports.getArtistId = async (name) => {
  let artist = await Artist.findOne({
    where: { name }
  });

  let artistId;

  // if the artist doesn't exist create it and get the id
  if (!artist) {
    //create the artist
    artist = await Artist.create({
      name
    });
    artistId = artist.id;
  } else {
    artistId = artist.id;
  }

  return artistId;
};

exports.createTrack = async (isrc, artistId, spotifyTrack) => {
  const track = await Track.create({
    isrc,
    title: spotifyTrack.album.name,
    artist_id: artistId,
    image: spotifyTrack.album.images[0].url
  });

  return track;
};

exports.getTrackByIsrc = async (isrc) => {
  return await Track.findOne({
    attributes: ["id", "isrc", "title", "image"],
    where: { isrc },
    include: [
      {
        model: Artist,
        attributes: ["id", "name"],
        as: "artist"
      }
    ]
  });
};

exports.getTrackByTitle = async (title) => {
  //search the track
  return (track = await Track.findAll({
    attributes: ["id", "isrc", "title", "image"],
    where: {
      title: { [Op.iLike]: "%" + title + "%" }
    },
    include: [
      {
        model: Artist,
        attributes: ["id", "name"],
        as: "artist"
      }
    ]
  }));
};
