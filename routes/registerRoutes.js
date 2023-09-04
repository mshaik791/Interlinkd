const express = require('express');
const app = express();
const router = express.Router();

app.set("view engine", "pug"); //using pug engine template
app.set("views", "views")


router.get("/", (req, res, next) => {

    res.status(200).render("register");

})


module.exports = router;
