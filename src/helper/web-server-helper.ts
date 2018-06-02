import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import {DbHelper} from "./db-helper";
import {getConnection} from "typeorm";
import {UserRepository} from "../repository/UserRepository";
import * as bcrypt from 'bcrypt';
import {ErrorObject} from "../class/ErrorObject";
import {MotionHelper} from "./motion-helper";
import {ConfigObject} from "../class/ConfigObject";
import {MotionSettingsError} from "../exception/MotionSettingsError";

let config = require('../../config.json');

export class WebServerHelper {
    constructor(motionHelper: MotionHelper) {
        const WEB_SERVER_PORT = 8080;
        const API_URL = '/api/';

        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false, type: 'application/json'}));
        app.use(express.static(__dirname + '/../angular/dist/'));
        app.use(session({secret: config.expressSecret, resave: true, saveUninitialized: true}));


        app.post(API_URL + 'login', async (req: any, res, next) => {

                let receivedUsername = req.body.username;
                let receivedPassword = req.body.password;

                if (receivedUsername == undefined || receivedUsername.trim().length == 0) {
                    res.status(400);
                    res.send(new ErrorObject(ErrorObject.EMPTY_USERNAME));
                    return next();
                }

                if (receivedPassword == undefined || receivedPassword.trim().length == 0) {
                    res.status(400);
                    res.send(new ErrorObject(ErrorObject.EMPTY_USERNAME));
                    return next();
                }

                let user = await getConnection().getCustomRepository(UserRepository)
                    .findByUsername(receivedUsername);

                if (user == undefined) {
                    res.status(400);
                    res.send(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                    return next();
                }

                let matches = await bcrypt.compare(receivedPassword, user.password);
                if (!matches) {
                    res.status(400);
                    res.send(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                    return next();
                }
                req.session.userId = user.id;
                req.session.groupId = user.group.id;
                res.status(200);
                res.send({});
            }
        );

        app.get(API_URL + 'motion/settings', async (req: any, res, next) => {
            let settings = await motionHelper.settingsArray();
            res.status(200);
            res.send(settings);
        });
        app.post(API_URL + 'motion/settings/update', async (req: any, res, next) => {
            let settings = req.body;
            try {
                await motionHelper.editSettings(settings);
               // res.status(200);
                res.send({});
            }catch (e) {
                if (e instanceof MotionSettingsError){
                    res.status(400);
                    res.send(new ErrorObject(ErrorObject.MOTION_INVALID_SETTINGS));
                }else {
                    res.status(500);
                    res.send({});
                }
            }
        });


        app.get(API_URL + 'login/check', async (req: any, res, next) => {
            res.status(200);
            if (req.session.userId) {
                res.send({isLoggedIn: true});
            } else {
                res.send({isLoggedIn: false});
            }
        });

        app.get(API_URL + 'logout', async (req: any, res, next) => {
            if (req.session.userId) {
                req.logout();
                res.status(200);
                res.send();
            }else {
                res.status(401);
            }
        });

        app.get('*', function (req, res) {
            res.status(200)
                .sendFile(path.join(__dirname + '/../angular/dist/index.html'));
        });

        app.listen(WEB_SERVER_PORT);
        console.log('Started web server on ' + WEB_SERVER_PORT);
    }


    isAuthenticated(req, res, next): boolean {

        if (req.session.userId) {
            return next();
        }
        res.status(403);
    }
}