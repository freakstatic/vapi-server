import * as bcrypt from 'bcrypt';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import {Request, Response} from 'express';
import * as disk from 'diskusage';
import * as os from 'os';
import * as passport from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy} from 'passport-http-bearer';
import * as path from 'path';
import {getConnection} from 'typeorm';
import {ErrorObject} from '../class/ErrorObject';
import {TokenManager} from '../class/token.manager';
import {User} from '../entity/User';
import {MotionSettingsError} from '../exception/MotionSettingsError';
import {DetectableObjectRepository} from '../repository/DetectableObjectRepository';
import {DetectionRepository} from '../repository/DetectionRepository';
import {UserRepository} from '../repository/UserRepository';
import {MotionHelper} from './MotionHelper';
import {TimelapseHelper} from './TimelapseHelper';
import {Timelapse} from '../entity/Timelapse';
import {NotificationHelper} from "./NotificationHelper";
import {NotificationSubscription} from "../entity/NotificationSubscription";
import {DetectableObject} from "../entity/DetectableObject";
import {InvalidSubcriptionException} from "../exception/InvalidSubcriptionException";

const getSize = require('get-folder-size');
const util = require('util');
const spawn = require('child_process').spawn;

export class WebServerHelper {
    constructor(motionHelper: MotionHelper, notificationHelper: NotificationHelper) {
        const WEB_SERVER_PORT = 8080;
        const API_URL = '/api/';

        const bearTokenOptions = {
            session: false,
            failureFlash: false
        };
        const AUTH_STRATEGY = 'bearer';

        const app = express();
        const tokenManager = new TokenManager();

        passport.use(new BasicStrategy((username: string, password: string, done: any) => {
            if (username == undefined || username.trim().length == 0) {
                done(null, false, new ErrorObject(ErrorObject.EMPTY_USERNAME));
                return;
            }

            if (password == undefined || password.trim().length == 0) {
                done(null, false, new ErrorObject(ErrorObject.EMPTY_PASSWORD));
                return;
            }

            getConnection().getCustomRepository(UserRepository).findByUsername(username)
                .then((user: User) => {
                    if (user == null || user == undefined) {
                        done(null, false, new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                        return;
                    }

                    bcrypt.compare(password, user.password)
                        .then(matches => {
                            if (!matches) {
                                done(null, false, new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                                return;
                            }
                            done(null, user);
                        });
                })
                .catch(reason => {
                    done(null, false, reason);
                });
        }));

        passport.use(new Strategy((token: string, done: any) => {
            if (token == null || token == undefined || token.trim().length < 1) {
                done(null, false, new ErrorObject(ErrorObject.EMPTY_TOKEN));
                return;
            }
            getConnection().getCustomRepository(UserRepository).findByToken(token)
                .then((user: User) => {
                    if (user == null || user == undefined) {
                        done(null, false, new ErrorObject(ErrorObject.INVALID_TOKEN));
                        return;
                    }

                    if (!tokenManager.validateToken(user, token)) {
                        done(null, false);
                        return;
                    }
                    done(null, user);
                })
                .catch(ex => {
                    done(null, false, ex);
                });
        }));

        passport.serializeUser((user: User, done) => {
            if (user == null || user == undefined) {
                done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                return;
            }

            if (user.id == null || user.id == undefined) {
                done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                return;
            }

            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            if (id == null || id == undefined) {
                done(new ErrorObject(ErrorObject.EMPTY_USER_ID));
                return;
            }

            getConnection().getCustomRepository(UserRepository).findOne(id)
                .then((user) => {
                    if (user == null || user == undefined) {
                        done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                        return;
                    }
                    done(null, user);
                });
        });

        //app.use(express.static('public'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true, type: 'application/json'}));

        app.use(passport.initialize());

        app.post(API_URL + 'login', passport.authenticate('basic', {
            session: false,
            failureFlash: false
        }), async (req: Request, res: Response) => {
            let user = req.user as User;
            if (!tokenManager.computeFromUser(user)) {
                res.sendStatus(401);
                return;
            }
            let updated = await getConnection().getCustomRepository(UserRepository).update(user.id, {token: user.token});
            if (updated.raw.affectedRows != 1) {
                res.status(500).send(new ErrorObject(ErrorObject.CANNOT_UPDATE_USER_TOKEN));
            }
            else {
                res.status(200).send({token: user.token});
            }
            return;
        });

        app.post(API_URL + 'login/refresh', (req: Request, res) => {
            let authorization = req.headers.authorization;
            if (authorization == undefined || authorization == null || authorization.trim().length < 1) {
                res.sendStatus(401);
                return;
            }
            let authorizationArray = authorization.split(' ');
            if (authorizationArray == undefined || authorizationArray == null || authorizationArray.length != 2) {
                res.sendStatus(401);
                return;
            }
            if (authorizationArray[0] != 'Bearer') {
                res.sendStatus(401);
                return;
            }
            if (authorizationArray[1] == undefined || authorizationArray[1] == null || authorizationArray[1].trim().length < 1) {
                res.sendStatus(401);
                return;
            }
            getConnection().getCustomRepository(UserRepository).findByToken(authorizationArray[1]).then(async user => {
                if (user == null || user == undefined) {
                    res.sendStatus(401);
                    return;
                }
                if (!tokenManager.computeFromUser(user)) {
                    res.sendStatus(401);
                    return;
                }
                let updated = await getConnection().getCustomRepository(UserRepository).update(user.id, {token: user.token});
                if (updated.raw.affectedRows != 1) {
                    res.status(500).send(new ErrorObject(ErrorObject.CANNOT_UPDATE_USER_TOKEN));
                }
                else {
                    res.status(200).send({token: user.token});
                }
                return;
            });
        });

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
            }
            catch (e) {
                if (e instanceof MotionSettingsError) {
                    res.status(400);
                    res.send(new ErrorObject(ErrorObject.MOTION_INVALID_SETTINGS));
                }
                else {
                    res.status(500);
                    res.send({});
                }
            }
        });

        app.get(API_URL + 'detection', passport.authenticate('bearer', bearTokenOptions), async (req: any, res, next) => {
            let startDate = null;
            let endDate = null;
            if (req.query.startDate !== undefined && req.query.startDate !== null) {
                startDate = new Date(req.query.startDate);
            }
            if (req.query.endDate !== undefined && req.query.endDate !== null) {
                endDate = new Date(req.query.endDate);
            }
            let detections = await getConnection().getCustomRepository(DetectionRepository).get(startDate, endDate);
            res.status(200).send(detections);
        });

        app.get(API_URL + 'stats/detection', passport.authenticate('bearer', bearTokenOptions), async (req: any, res, next) => {
            let startDate = null;
            let endDate = null;
            if (req.query.startDate !== undefined && req.query.startDate !== null) {
                startDate = new Date(req.query.startDate);
            }
            if (req.query.endDate !== undefined && req.query.endDate !== null) {
                endDate = new Date(req.query.endDate);
            }
            let detections = await getConnection().getCustomRepository(DetectionRepository).getStats(startDate, endDate);
            if (detections == null) {
                res.status(204).send();
            }
            res.status(200).send(detections);
            return;
        });

        app.get(API_URL + 'stats/detection/time', passport.authenticate('bearer', bearTokenOptions), async (req: Request, res: Response) => {
            let dbObjs = await getConnection().getCustomRepository(DetectionRepository).getStatsTime();
            if (dbObjs == null) {
                res.sendStatus(204);
            }
            else {
                res.status(200).send(dbObjs);
            }
            return;
        });

        app.get(API_URL + 'storage', passport.authenticate('bearer', bearTokenOptions), (req: Request, res: Response) => {
            const path = os.platform() === 'win32' ? 'c:' : '/';
            const diskSpace = {} as any;
            disk.check(path, (error: any, info: any) => {
                if (!error) {
                    diskSpace.diskSpace = info.total / 1048576;
                }


                let du = spawn('du', ['-hm', motionHelper.settings.target_dir] as ReadonlyArray<string>);
                du.stdout.on('data', function (data: Uint8Array) {
                    let dataString = String.fromCharCode.apply(null, data);

                    let splitData = dataString.split('\t');
                    let size = splitData[0];
                    console.log('size: ' + size);
                    diskSpace.usedSpace = size;
                    res.status(200).send(diskSpace);
                });

                du.on('exit', function (code) {
                    if (code != 0) {
                        res.status(500).send({});
                    }
                });

                du.on('error', function (err) {
                    res.status(500).send({});
                });

            });
        });

        app.get(API_URL + 'users', async (req: any, res, next) => {
            let users = await getConnection().getRepository(User).find({});

            for (let user of users) {
                delete user.password;
            }

            res.status(200).send(users);
        });

        app.get(API_URL + 'timelapse/codecs', async (req: any, res, next) => {
            let codecs = await TimelapseHelper.getCodecs();
            res.status(200).send(codecs);
        });
        app.get(API_URL + 'stats/detectable/top5', passport.authenticate(AUTH_STRATEGY, bearTokenOptions), async (req: Request, res: Response) => {
            let response = await getConnection().getCustomRepository(DetectableObjectRepository).getTop5();
            if (response == undefined || response == null) {
                res.sendStatus(204);
            }
            else {
                res.status(200).send(response);
            }
            return;
        });

        app.get(API_URL + 'timelapse/codecs', async (req: any, res, next) => {
            let codecs = await TimelapseHelper.getCodecs();
            res.status(200).send(codecs);
        });

        app.get(API_URL + 'timelapse/formats', async (req: any, res, next) => {
            let formats = await TimelapseHelper.getFormats();
            res.status(200).send(formats);
        });

        app.get(API_URL + 'timelapses', async (req: any, res, next) => {
            let timelapses = await getConnection().getRepository(Timelapse).find();
            res.status(200).send(timelapses);
        });

        app.get(API_URL + 'timelapse/:timelapseId/thumbnail', async (req: any, res, next) => {
            let timelapseId = req.params.timelapseId;
            let timelapse = await getConnection().getRepository(Timelapse).findOne(timelapseId);
            let filePath = __dirname + '/../../' + TimelapseHelper.THUMBNAILS_FOLDER + '/' + timelapse.thumbnail;
            res.status(200).download(path.resolve(filePath), timelapse.thumbnail);
        });

        app.get(API_URL + 'timelapse/:timelapseId/video', async (req: any, res, next) => {
            let timelapseId = req.params.timelapseId;
            let timelapse = await getConnection().getRepository(Timelapse).findOne(timelapseId);
            let filePath = __dirname + '/../../' + TimelapseHelper.VIDEOS_FOLDER + '/' + timelapse.filename;
            res.status(200).download(path.resolve(filePath), timelapse.filename);
        });

        app.get(API_URL + 'timelapse/:timelapseId/mosaic', async (req: any, res, next) => {
            let timelapseId = req.params.timelapseId;
            let timelapse = await getConnection().getRepository(Timelapse).findOne(timelapseId);
            let filePath = __dirname + '/../../' + TimelapseHelper.MOSAICS_FOLDER + '/' + timelapse.mosaic;
            res.status(200).download(path.resolve(filePath), timelapse.mosaic);
        });

        app.get(API_URL + 'detectable-objects', async (req: any, res, next) => {
            let detectableObjects = await getConnection().getRepository(DetectableObject).find({});
            res.send(detectableObjects);
        });

        app.post(API_URL + 'notification/subscription/add', async (req: any, res, next) => {
            let sub = req.body;
            let language = req.headers.language;
            await notificationHelper.handleNewSubscription(sub, language);
            res.status(200).send({});
        });

        app.post(API_URL + 'notification/subscription/detectable-objects', async (req: any, res, next) => {
            let auth = req.body.keys.auth;
            let detectableObjects = await notificationHelper.getSubscriptionDetectableObjects(auth);
            res.send(detectableObjects);
        });

        app.post(API_URL + 'notification/subscription/detectable-objects/add', async (req: any, res, next) => {
            let sub = req.body.sub;
            let subscriptionDetectableObjects = req.body.subscriptionDetectableObjects;

            try {
                await notificationHelper.addSubscriptionDetectableObjects(sub, subscriptionDetectableObjects);
                res.status(200).send({});
            } catch (e) {
                res.status(400);
                if (e instanceof InvalidSubcriptionException) {
                    res.send(new ErrorObject(ErrorObject.SUBSCRIPTION_INVALID));
                }
            }

        });

        app.use(express.static(__dirname + '/../../angular/dist/'));

        app.get('*', function (req, res) {
            res.status(200)
                .sendFile(path.join(__dirname + '/../../angular/dist/index.html'));
        });

        app.listen(WEB_SERVER_PORT);
        console.log('Started web server on ' + WEB_SERVER_PORT);
    }
}