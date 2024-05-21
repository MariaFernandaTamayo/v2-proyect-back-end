const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    title: { type: String, required: true },
    submit: { type: Boolean, required: true },
});

module.exports = mongoose.model("Tweet", TweetSchema);