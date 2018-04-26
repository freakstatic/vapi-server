"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const express = require("express");
class SocketHelper {
    constructor(dbHelper) {
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
    }
}
exports.SocketHelper = SocketHelper;
//# sourceMappingURL=socket-helper.js.map