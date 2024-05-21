const jwt = require("jsonwebtoken");

function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
        return null;
    }
}

function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (e) {
        return null;
    }
}

function generateAccessToken(user) {
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: '1h',
    });
}

function generateRefreshToken(user) {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: '7d',
    });
}

module.exports = { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken };