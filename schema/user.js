const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../auth/generateTokens");
const getUserInfo = require("../lib/getUserInfo");
const Token = require("../schema/token");

const UserSchema = new mongoose.Schema({
    id: { type: Object },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Agregar una referencia a los tweets del usuario
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }]
});

UserSchema.pre("save", function(next) {
    if (this.isModified("password") || this.isNew) {
        const document = this;
        bcrypt.hash(document.password, 10, (err, hash) => {
            if (err) {
                next(err);
            } else {
                document.password = hash;
                next();
            }
        })
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = async function(password, hash) {
    const same = await bcrypt.compare(password, hash);
    return same;
};

UserSchema.methods.createAccessToken = function() {
    return generateAccessToken(getUserInfo(this));
};

UserSchema.methods.createRefreshToken = async function() {
    const refreshToken = generateRefreshToken(getUserInfo(this));
    try {
        await new Token({ token: refreshToken }).save();
        return refreshToken;
    } catch (error) {
        console.log(error);
    }
};

module.exports = mongoose.model("User", UserSchema);