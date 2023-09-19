const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema")
const Post = require("../../schemas/PostSchema")


app.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {
    Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({"createdAt": -1})
    .then(async (results) => {
        results = await User.populate(results, {path: "retweetData.postedBy"});
        res.status(200).send(results)
    })
    .catch(error => {
        console.log(error)
        res.sendStatus(400);
    })


})

router.post("/", async (req, res, next) => {

    if(!req.body.content) {
        console.log("Content parameter not sent with request");
        return res.sendStatus(400);
    }  

    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    //create posts and put into database
    Post.create(postData)
    .then(async newPost => {

        newPost = await User.populate(newPost, {path: "postedBy"})

        res.status(201).send(newPost);

    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })


})


// router.put("/:id/like", async (req, res, next) => {
//     //the id in the url can be whatever you refer to in the code block
    
//     var postId = req.params.id;
//     var userId = req.session.user

//     console.log(userId);

//     var userId = userId._id;


//     //check to see if the user id exists in likes database
//     var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

//     var option = isLiked ? "$pull" : "$addToSet";

//     // console.log(isLiked);
//     // console.log(option);
//     // console.log(userId);

//     //inser user like
//     req.session.user = await User.findByIdAndUpdate(userId, { [option]: {likes: postId }}, {new: true}) 
//     //new: true is there so that the session for the user has the new likes object
//     .catch(error => {
//         console.log(error);
//         res.sendStatus(400);
//     })

//     //option is conditional, brackets around it so it works as a variable

//     //Insert post like

    



// })
router.put("/:id/like", async (req, res, next) => {

    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})

router.post("/:id/retweet", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    // Try and delete retweet
    var deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    var option = deletedPost != null ? "$pull" : "$addToSet";

    var repost = deletedPost;

    if (repost == null) {
        repost = await Post.create({ postedBy: userId, retweetData: postId })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    }

    // 
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // 
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})



module.exports = router;
