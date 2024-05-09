const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");
const getUserInfo = require("../lib/getUserInfo");

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    // Verificar que se proporcionen los campos necesarios
    if (!username || !password) {
        return res.status(400).json(jsonResponse(400, {
            error: "Fields are required",
        }));
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json(
                jsonResponse(400, {
                    error: "User not found",
                })
            );
        }

        const correctPassword = await user.comparePassword(password, user.password);

        if (correctPassword) {
            // Autenticar al usuario
            const accessToken = user.createAccessToken();
            const refreshToken = await user.createRefreshToken();

            // Envía la respuesta con los tokens y la información del usuario
            res.status(200).json(jsonResponse(200, {
                user: getUserInfo(user),
                accessToken,
                refreshToken
            }));
        } else {
            // La contraseña es incorrecta
            res.status(400).json(
                jsonResponse(400, {
                    error: "User or Password incorrect",
                })
            );
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json(
            jsonResponse(500, {
                error: "Internal Server Error",
            })
        );
    }
});

module.exports = router;