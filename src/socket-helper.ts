import * as http from'http';
import * as express from 'express';
import {DbHelper} from "./db-helper";
import {getConnection} from "typeorm";
import {User} from "./entity/User";

export class SocketHelper {
    constructor(dbHelper: DbHelper){
        const socketApp = express();
        const server = http.createServer(socketApp);
        const io = require('socket.io')(server);
        io.on('connection', function (client : any) {
            console.log('connected');

            client.on('detection', function (data : any) {
                console.log(data);
            });

            client.on('disconnect', function () {
                console.log('connected');
            });
        });
        server.listen(3000);
    }
}