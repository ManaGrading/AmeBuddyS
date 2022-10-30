var http = require("http");

//This is what called when we go to this address.
var server = http.createServer( 
    (req, res) => { 
        res.statusCode = 200;
        res.setHeader("content-type", "text/plain");
        res.end("Hell web");
    }
);


server.listen (8000);