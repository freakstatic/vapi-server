"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const express = require("express");
const typeorm_1 = require("typeorm");
const Detection_1 = require("./entity/Detection");
const moment = require("moment");
const DetectionObject_1 = require("./entity/DetectionObject");
const DetectableObject_1 = require("./entity/DetectableObject");
const DetectableObjectRepository_1 = require("./repository/DetectableObjectRepository");
let config = require('../config.json');
class SocketHelper {
    constructor(dbHelper) {
        const socketApp = express();
        const server = http.createServer(socketApp);
        const io = require('socket.io')(server);
        io.on('connection', client => {
            console.log('connected');
            client.on('detection', (arrayOfDetections) => __awaiter(this, void 0, void 0, function* () {
                this.handleNewDetections(arrayOfDetections).catch((error) => {
                    console.error('[socket-helper] [detection] ' + error);
                });
            }));
            client.on('disconnect', () => {
                console.log('connected');
            });
        });
        server.listen(config.socketPort);
    }
    handleNewDetections(detectionsArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let detection = new Detection_1.Detection();
                detection.date = moment().toDate();
                let detectableObjectRepository = typeorm_1.getConnection()
                    .getCustomRepository(DetectableObjectRepository_1.DetectableObjectRepository);
                let promises = detectionsArray.map((detectionObjectReceived) => __awaiter(this, void 0, void 0, function* () {
                    let detectionObject = new DetectionObject_1.DetectionObject();
                    detectionObject.object = yield detectableObjectRepository
                        .findByName(detectionObjectReceived.className);
                    if (detectionObject.object == undefined) {
                        detectionObject.object = new DetectableObject_1.DetectableObject();
                        detectionObject.object.name = detectionObjectReceived.className;
                        detectionObject.object = yield detectableObjectRepository.save(detectionObject.object);
                    }
                    detectionObject.probability = detectionObjectReceived.probability;
                    let box = detectionObjectReceived.box;
                    detectionObject.x = box.x;
                    detectionObject.y = box.y;
                    detectionObject.width = box.w;
                    detectionObject.height = box.h;
                    detectionObject.id = null;
                    detectionObject = yield typeorm_1.getConnection().getRepository(DetectionObject_1.DetectionObject).save(detectionObject);
                    return detectionObject;
                }));
                detection.numberOfDetections = detectionsArray.length;
                detection.detectionObjects = yield Promise.all(promises);
                yield typeorm_1.getConnection().getRepository(Detection_1.Detection).save(detection);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.SocketHelper = SocketHelper;
//# sourceMappingURL=socket-helper.js.map