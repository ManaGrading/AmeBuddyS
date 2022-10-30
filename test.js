var http = require("http");

var count = 0;

//This is what called when we go to this address.
var server = http.createServer( 
    (req, res) => { 
        console.log("Hit!");
        res.statusCode = 200;
        res.setHeader("content-Type", "text/plain");
        count++;
        res.end("Hell web");
    }
);


server.listen (8000);