#!/usr/bin/env node

var bouncy = require('bouncy');
var url = require("url");

if (process.argv.length < 4) {
    console.log("usage: api-server <apiRoot> <apiHost> <apiPort>");
    process.exit(1);
}

var apiRoot = process.argv[2];
var apiHost = process.argv[3];
var apiPort = process.argv[4] || 80;

var httpServer = require("http-server");
httpServer.createServer({
    root: "./"
}).listen(8080);

var server = bouncy(function (req, res, bounce) {
    var uri = url.parse(req.url).pathname;
    var uriArray = uri.split("/");
    console.log(uri);
    if (uriArray.length > 2) {
        var s = uriArray[1];
        if (s === apiRoot) {
            console.log("bouncing to " + apiHost + ":" + apiPort);
            bounce(apiHost, apiPort, {
                headers: {
                    Connection: "close",
                    host: apiHost,
                    port: apiPort
                }
            });
            return;
        }
    }
    console.log("serving locally");
    bounce("localhost", 8080, {
        headers: {
            Connection: "close"
        }
    });
});
server.listen(8000);

