const displayContent = (req, res) => {

    const url = req.url;
    const method = req.method;

    if(url == "/profile"){
        res.setHeader('Content-Type', 'text/html'); //telling browser what content your sending
        res.write('<p>This is the profile page</p>');
        return res.end();  

    } else if (url == "/") {
        res.setHeader('Content-Type', 'text/html'); //telling browser what content your sending
        res.write('<p>Home</p>');
        return res.end(); 
    } else if (url == "/settings" && method=="POST") {
        res.setHeader('Content-Type', 'text/html'); //telling browser what content your sending
        res.write('<h1>Form was submitted</h1>');
        return res.end(); 
    } else if (url == "/settings") {
        res.setHeader('Content-Type', 'text/html'); //telling browser what content your sending
        res.write('<p>Settings</p><form action="/settings" method="POST"><input type="text"><button type="submit">Press Me</button></form>');
        return res.end(); 
    }

    res.setHeader('Content-Type', 'text/html'); //telling browser what content your sending
    res.write('<p>Page not found</p>');
    res.end();
}


module.exports = displayContent;