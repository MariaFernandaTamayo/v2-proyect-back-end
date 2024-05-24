const { jsonResponse } = require("../lib/jsonResponse");
const router = require("express").Router();


router.get("/", (req, res) => {
  res.status(200).json(jsonResponse(200, req.user));
});

router.get("/my-tweets", async (req, res) => {
  try {
    const userId = req.user._id; // Verifica que estés obteniendo el user ID correctamente
    const tweets = await Tweet.find({ idUser: userId });
    res.status(200).json(jsonResponse(200, tweets));
  } catch (err) {
    res.status(500).json(jsonResponse(500, 'Error al obtener los tweets'));
  }
});

module.exports = router;