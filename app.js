const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database")
const session = require("express-session");

const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "pug"); //using pug engine template
app.set("views", "views")


app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public"))); //serving static files, good practice

app.use(session({
    secret: "hello", //hashes the session, can use any string
    resave: true,
    saveUninitialized: false
 }))

//Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logout')

//Api routes
const postsApiRoute = require('./routes/api/posts');

app.use("/login", loginRoute); // for login page
app.use("/register", registerRoute); // for register page
app.use("/logout", logoutRoute); // for logout 
app.use("/api/posts", postsApiRoute);



app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
        //stringify to turn to string so i can pass it between calls

    }
    res.status(200).render("home", payload);

})
