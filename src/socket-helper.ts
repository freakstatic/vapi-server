import * as http from 'http';
import * as express from 'express';
import {DbHelper} from "./db-helper";
import {getConnection} from "typeorm";
import {User} from "./entity/User";
import {Detection} from "./entity/Detection";
import moment = require("moment");
import {DetectionObject} from "./entity/DetectionObject";
import {DetectableObject} from "./entity/DetectableObject";
import {DetectionRepository} from "./repository/DetectionRepository";
import {DetectableObjectRepository} from "./repository/DetectableObjectRepository";


export class SocketHelper {
    constructor(dbHelper: DbHelper) {
        const socketApp = express();
        const server = http.createServer(socketApp);
        const io = require('socket.io')(server);
        io.on('connection', client => {
            console.log('connected');

            client.on('detection', async data => {
                console.log(data);
                let json = JSON.parse(data);

                this.handleNewDetection(json).catch((error) => {
                    console.error('[socket-helper] [detection] ' + error);
                });
            });

            client.on('disconnect', () => {
                console.log('connected');
            });
        });
        server.listen(3000);
    }


    async handleNewDetection(detectionJson){
        try {
            let detection = new Detection();
            detection.date = moment().toDate();
            let detectableObjectRepository = getConnection()
                .getCustomRepository(DetectableObjectRepository);

            let promises = <Promise<DetectionObject>[]> detectionJson.map(
                async (detectionObjectReceived): Promise<DetectionObject> => {

                    let detectionObject = new DetectionObject();

                    detectionObject.object = await detectableObjectRepository
                        .findByName(detectionObjectReceived[0]);

                    if (detectionObject.object == undefined) {
                        detectionObject.object = new DetectableObject();
                        detectionObject.object.name = detectionObjectReceived[0];
                        detectionObject.object = await detectableObjectRepository.save(detectionObject.object);
                    }

                    detectionObject.score = detectionObjectReceived[1];
                    let box = detectionObjectReceived[2];
                    detectionObject.x = box[0];
                    detectionObject.y = box[1];
                    detectionObject.width = box[2];
                    detectionObject.height = box[3];
                    detectionObject = await getConnection().getRepository(DetectionObject).save(detectionObject);
                    return detectionObject;
                });
            detection.detectionObjects = await Promise.all(promises);
            await getConnection().getRepository(Detection).save(detection);
        }catch (e) {
            console.error(e);
        }
    
    }
}