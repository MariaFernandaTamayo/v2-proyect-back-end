const router = require ("express").Router();
const Tweet = require ("../schema/tweet");

router.get("/", (req,res) => {
    res.json([
        {
            id: 1,
            //title: "John Doe",
            submit: false,
        },
    ]);
});
router.post("/", async (req,res) => {
    if(!req.body.title){
        res.status(400).json({error: "Title is required"})
    }
    try{
        const tweet = new Tweet ({
            title: req.body.title,
            submit:false,
            idUser: req.user.id,
        });
        const newTweet= await tweet.save();
        res.json(newTweet);
    }catch(error){
        console.log(error);
    }

});
module.exports = router;