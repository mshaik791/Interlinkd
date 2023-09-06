const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser") //to access body details
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt"); //hash password

app.set("view engine", "pug"); //using pug engine template
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false}));


router.get("/", (req, res, next) => {

    res.status(200).render("register");

})

router.post("/", async (req, res, next) => {

    // console.log(req.body) //logged so i can see user registration details
    var firstName = req.body.firstName.trim(); //to trim white spaces before and after name just in case
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body; //creating a object to autofill users fields only if fields are not valid
    //goes back to /register route with filled in entries

    if(firstName && lastName && username && email && password){ //checking for valid fields
        var user = await User.findOne({ 
            $or: [ //going to check if this user already exists
                {username: username},
                {email: email},
            ]
        })
        // .then((user) => {
        //     console.log(user);
        // }) 
        //^asynchronous function meaning this will be running in the background and will take some time and code will proceed to run
        .catch((error) => {
            console.log(error);

            payload.errorMessage = "Something went wrong.";
            res.status(200).render("register", payload);
        });

        if(user == null){
            //NO user is found
            var data = req.body;

            data.password = await bcrypt.hash(password, 10); //dont 2^10 time hashing, password secure
            User.create(data)
            .then((user) => {
                req.session.user = user;
                console.log(user);

                return res.redirect("/");

            })
        }
        else{
            //User found
            if(email == user.email){
                payload.errorMessage = "Email already in use.";
            }
            else{
                payload.errorMessage = "Username is already in use.";
            }
            res.status(200).render("register", payload);
        }

       //console.log("hello"); 
       //this runs before the .then()
        //now with await() ths problem in codeflow is fixed
    }
    else{
        payload.errorMessage = "Please make sure field has a valid entry." 
        res.status(200).render("register", payload); //pass in payload object
    }

})


module.exports = router;
