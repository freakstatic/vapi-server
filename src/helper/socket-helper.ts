import * as express from 'express';
import * as http from 'http';
import {getConnection} from 'typeorm';
import {ErrorObject} from '../class/ErrorObject';
import {TokenManager} from '../class/token.manager';
import {Detection} from '../entity/Detection';
import {DetectionObject} from '../entity/DetectionObject';
import {User} from '../entity/User';
import {DetectionRepository} from '../repository/DetectionRepository';
import {UserRepository} from '../repository/UserRepository';
import {TimelapseHelper} from './TimelapseHelper';
import {DetectionHelper} from './DetectionHelper';

let config = require('../../config.json');
const YOLO_GROUP_NAME = 'yolo';
const USER_ROOM = 'user';
const tokenManager = new TokenManager();

export class SocketHelper {
    constructor(detectionHelper: DetectionHelper) {
        const socketApp = express();
        const server = http.createServer(socketApp);
        const io = require('socket.io')(server);
        io.on('connection', client => {
            let socketLoggedIn = false;
            let user: User = null;
            console.log('connected');

            client.on('authenticate', async token => {
                if (socketLoggedIn && user != null && tokenManager.validateToken(user, token)) {
                    return;
                }
                let temp_user = await this.checkUserCredentials(token);
                if (temp_user == null || temp_user == undefined || !tokenManager.validateToken(temp_user, token)) {
                    socketLoggedIn = false;
                    user = null;
                    client.disconnect(true);
                    return;
                }

                socketLoggedIn = true;
                user = temp_user;
                console.log(user.username+' authenticated');
                if (user.group.name === YOLO_GROUP_NAME) {
                    client.join('yolo');
                    client.on('detection', async obj => {
                        try {
                            const detection:Detection = await detectionHelper.handleDetectionReceived(obj);
                            detection.detectionObjects.then((detectionObjects:DetectionObject[])=>
                            {
                             client.broadcast.to(USER_ROOM).emit('detection', {
                              id:detection.id,
                              date:detection.date,
                              detectionObjects:detectionObjects,
                              numberOfDetections:detection.numberOfDetections,
                              image:detection.image,
                              event:detection.event
                             });
                            });
                        }
                        catch (error) {
                            console.error('[socket-helper] [detection] ' + error);
                        }

                    });
                }
                else {
                    client.join(USER_ROOM);

                    client.on('timelapse/create', async (data) => {
                        console.log('[SocketHelper] [timelapse/create]');
                        let detections = await getConnection()
                            .getCustomRepository(DetectionRepository).getByDatesWithRelations(data.startDate, data.endDate);
                        if (detections.length) {
                            TimelapseHelper.create(detections, data.codec, data.format, data.fps, client, user);
                        }
                        else {
                            client.emit('timelapse/error', new ErrorObject(ErrorObject.TIMELAPSE_NO_DETECTIONS))
                        }

                    });
                }
            });

            client.on('disconnect', () => {
                console.log('disconnected');
                client.disconnect(false);
            });
        });
        server.listen(config.socketPort);
    }

    private async checkUserCredentials(token: string): Promise<User> {
        if (token == null || token.trim().length < 1) {
            return null;
        }

        return await getConnection().getCustomRepository(UserRepository).findByToken(token);
    }


}