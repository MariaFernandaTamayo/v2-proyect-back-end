const router = require ("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require ("../schema/user");

router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json(
                jsonResponse(400, {
                    error: "Fields are required",
                })
            );
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(200).json(jsonResponse(200, { message: "User created successfully" }));
    } catch (error) {
        if (error.code && error.code === 11000) {
            // Violación de restricción única (username o email duplicados)
            let field;
            if (error.keyValue.username) {
                field = "username";
            } else if (error.keyValue.email) {
                field = "email";
            }

            return res.status(400).json(
                jsonResponse(400, {
                    error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
                })
            );
        } else {
            // Otro error
            console.error(error);
            res.status(500).json(
                jsonResponse(500, {
                    error: "Error creating user",
                })
            );
        }
    }
});
module.exports = router;