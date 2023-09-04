exports.requireLogin = (req, res, next) => {
    if(req.session && req.session.user){ //user property exists or not
        return next(); //moves onto next
    }
    else{
        return res.redirect('/login')
    }

}