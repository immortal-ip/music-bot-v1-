const { Schema, model } = require("mongoose");

const playlistSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    songs: { type: Array, default: [] },
    isPrivate: { type: Boolean, default: false },
    created: { type: String, required: true }
});

module.exports = model("playlist", playlistSchema);