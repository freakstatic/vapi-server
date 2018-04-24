import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import {DbHelper} from "./db-helper";
import {User} from "./entity/User";
import {getConnection} from "typeorm";
import {UserRepository} from "./repository/UserRepository";
import bcrypt from 'bcrypt';

export class WebServerHelper {
    constructor(dbHelper: DbHelper){
        const WEB_SERVER_PORT = 8080;
        const API_URL = '/api/';

        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(express.static(__dirname + '/../angular/dist/'));

        app.get('/', function(req, res) {
            res.status(200)
                .sendFile(path.join(__dirname+'/../angular/dist/index.html'));
        });

        app.post(API_URL + 'login', async (req, res, next) => {

            let username = req.body.username;
            let password = req.body.password;

            if (username == undefined || username.trim().length == 0){
                res.status(400);
                res.send({ error: 'Empty username' });
                return;
            }

            if (password == undefined || password.trim().length == 0) {
                res.status(400);
                res.send({ error: 'Empty password' });
                return;
            }

            let user = await getConnection().getCustomRepository(UserRepository).findByUsername(username);

        });


        app.listen(WEB_SERVER_PORT);
        console.log('Started web server on ' + WEB_SERVER_PORT);
    }
}