import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
const WEB_SERVER_PORT = 8080;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../angular/dist/'));

app.get('/', function(req : any, res : any, next : any) {
    res.status(200)
        .sendFile(path.join(__dirname+'/../angular/dist/index.html'));
});
app.listen(WEB_SERVER_PORT);
console.log('Started web server on ' + WEB_SERVER_PORT);


import * as http from'http';
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