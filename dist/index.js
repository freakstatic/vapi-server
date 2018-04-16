"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const WEB_SERVER_PORT = 8080;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../angular/dist/'));
app.get('/', function (req, res, next) {
    res.status(200)
        .sendFile(path.join(__dirname + '/../angular/dist/index.html'));
});
app.listen(WEB_SERVER_PORT);
console.log('Started web server on ' + WEB_SERVER_PORT);
const http = require("http");
const socketApp = express();
const server = http.createServer(socketApp);
const io = require('socket.io')(server);
io.on('connection', function (client) {
    console.log('connected');
    client.on('detection', function (data) {
        console.log(data);
    });
    client.on('disconnect', function () {
        console.log('connected');
    });
});
server.listen(3000);
//# sourceMappingURL=index.js.map