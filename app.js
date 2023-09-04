const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path')


const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "pug"); //using pug engine template
app.set("views", "views")


app.use(express.static(path.join(__dirname, "public"))); //serving static files, good practice

//Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use("/login", loginRoute); // for login page
app.use("/register", registerRoute); // for register page


app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home"
    }
    res.status(200).render("home", payload);

})
