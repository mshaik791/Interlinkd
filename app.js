const express = require('express');
const app = express();

const port = 3000;


const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "pug"); //using pug engine template
app.set("views", "views")


app.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Home"
    }
    res.status(200).render("home", payload);

})
