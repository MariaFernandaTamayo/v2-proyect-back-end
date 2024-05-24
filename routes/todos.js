//todos.js
const router = require("express").Router();
const Tweet = require("../schema/tweet");

// Obtener todos los tweets
router.get("/", async (req, res) => {
    try {
        const tweets = await Tweet.find({ idUser: req.user.id });
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los tweets" });
    }
});

// Crear un nuevo tweet
router.post("/", async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ error: "Title is required" });
    }
    try {
        const tweet = new Tweet({
            title: req.body.title,
            submit: false,
            idUser: req.user.id,
        });
        const newTweet = await tweet.save();
        res.json(newTweet);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el tweet" });
    }
});

// Borrar un tweet
router.delete("/:id", async (req, res) => {
    try {
        const tweet = await Tweet.findOneAndDelete({ _id: req.params.id, idUser: req.user.id });
        if (!tweet) {
            return res.status(404).json({ error: "Tweet no encontrado" });
        }
        res.json({ message: "Tweet eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el tweet" });
    }
});

// Actualizar un tweet
router.put("/:id", async (req, res) => {
    try {
        const { title, submit } = req.body;
        const updatedTweet = await Tweet.findOneAndUpdate(
            { _id: req.params.id, idUser: req.user.id },
            { title, submit },
            { new: true }
        );

        if (!updatedTweet) {
            return res.status(404).json({ error: "Tweet no encontrado" });
        }

        res.json(updatedTweet);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el tweet" });
    }
});
// Obtener un tweet por ID (sin restricción de usuario)
router.get("/:id", async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet no encontrado" });
        }
        res.json(tweet);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el tweet" });
    }
});
// Obtener todos los tweets del usuario actual
router.get("/", async (req, res) => {
    try {
        const tweets = await Tweet.find({ idUser: req.user.id });
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los tweets" });
    }
});

module.exports = router;