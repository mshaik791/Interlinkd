const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt");

app.set("view engine", "pug"); //using pug engine template
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {

    res.status(200).render("login");

})

router.post("/", async (req, res, next) => {
    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword){ 
        var user = await User.findOne({ 
            $or: [ //going to check if this user already exists
                {username: req.body.logUsername},
                {email: req.body.logUsername},
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("login", payload);

        });

        if(user != null) {
            var result = await bcrypt.compare(req.body.logPassword, user.password)
            console.log(result);

            if(result === true){ //triple equal signs to make sure its the boolean value true
                console.log(result);
                req.session.user = user;
                return res.redirect("/");
            }
        }

         payload.errorMessage = "Login or Password incorrect.";
         return res.status(200).render("login", payload);

    }
    payload.errorMessage = "Make sure each field has a valid value!";
    res.status(200).render("login");

})





module.exports = router;
