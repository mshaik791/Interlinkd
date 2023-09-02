const http = require('http');
const displayContent = require("./routes")

var server = http.createServer(displayContent);

server.listen(3001);