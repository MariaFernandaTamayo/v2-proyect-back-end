const getTokenFromHeader = require("../auth/getTokenFromHeader");
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require("../auth/verifyTokens");
const { jsonResponse } = require("../lib/jsonResponse");

const router = require("express").Router();

router.post("/", async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);

    if (refreshToken) {
        try {
            const payload = verifyRefreshToken(refreshToken);
            if (payload) {
                const accessToken = generateAccessToken(payload.user);
                const newRefreshToken = generateRefreshToken(payload.user); // Generar un nuevo refreshToken
                // Guardar el nuevo refreshToken en la base de datos
                // Por ejemplo:
                // await Token.findOneAndUpdate({ token: refreshToken }, { token: newRefreshToken });
                return res.status(200).json(jsonResponse(200, { accessToken, refreshToken: newRefreshToken }));
            } else {
                return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
            }
        } catch (error) {
            return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
        }
    } else {
        res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
    }
});

module.exports = router;