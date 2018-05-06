import * as express from 'express';
import * as http from 'http';
import {getConnection} from "typeorm";
import {DetectableObject} from "../entity/DetectableObject";
import {Detection} from "../entity/Detection";
import {DetectionObject} from "../entity/DetectionObject";
import {DetectableObjectRepository} from "../repository/DetectableObjectRepository";
import {DbHelper} from "./db-helper";
import moment = require("moment");

let config = require('../../config.json');

export class SocketHelper {
    constructor(dbHelper: DbHelper) {
        const socketApp = express();
        const server = http.createServer(socketApp);
        const io = require('socket.io')(server);
        io.on('connection', client => {
            console.log('connected');

            client.on('detection', async arrayOfDetections => {
                this.handleNewDetections(arrayOfDetections).catch((error) => {
                    console.error('[socket-helper] [detection] ' + error);
                });
            });

            client.on('disconnect', () => {
                console.log('connected');
            });
        });
        server.listen(config.socketPort);
    }


    async handleNewDetections(detectionsArray){
        try {
            let detection = new Detection();
            detection.date = moment().toDate();
            let detectableObjectRepository = getConnection()
                .getCustomRepository(DetectableObjectRepository);

            let promises = <Promise<DetectionObject>[]> detectionsArray.map(
                async (detectionObjectReceived): Promise<DetectionObject> => {

                    let detectionObject = new DetectionObject();

                    detectionObject.object = await detectableObjectRepository
                        .findByName(detectionObjectReceived.className);

                    if (detectionObject.object == undefined) {
                        detectionObject.object = new DetectableObject();
                        detectionObject.object.name = detectionObjectReceived.className;
                        detectionObject.object = await detectableObjectRepository.save(detectionObject.object);
                    }

                    detectionObject.probability = detectionObjectReceived.probability;
                    let box = detectionObjectReceived.box;
                    detectionObject.x = box.x;
                    detectionObject.y = box.y;
                    detectionObject.width = box.w;
                    detectionObject.height = box.h;
                    detectionObject.id = null;
                    detectionObject = await getConnection().getRepository(DetectionObject).save(detectionObject);
                    return detectionObject;
                });
            detection.numberOfDetections = detectionsArray.length;
            detection.detectionObjects = Promise.all(promises);
            await getConnection().getRepository(Detection).save(detection);
        }catch (e) {
            console.error(e);
        }
    
    }
}