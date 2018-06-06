import * as express from 'express';
import * as http from 'http';
import {getConnection} from "typeorm";
import {TokenManager} from '../class/token.manager';
import {DetectableObject} from "../entity/DetectableObject";
import {Detection} from "../entity/Detection";
import {DetectionObject} from "../entity/DetectionObject";
import {User} from '../entity/User';
import {DetectableObjectRepository} from "../repository/DetectableObjectRepository";
import {UserRepository} from '../repository/UserRepository';
import {DbHelper} from "./db-helper";
import moment = require("moment");

let config = require('../../config.json');
const YOLO_GROUP_NAME = 'yolo';
const USER_ROOM = 'user';
const tokenManager = new TokenManager();

export class SocketHelper
{
 constructor(dbHelper: DbHelper)
 {
  const socketApp = express();
  const server = http.createServer(socketApp);
  const io = require('socket.io')(server);
  io.on('connection', client =>
  {
   let socketLoggedIn = false;
   let user: User = null;
   console.log('connected');

   client.on('authenticate', async token =>
   {
    if (socketLoggedIn && user != null && tokenManager.validateToken(user, token))
    {
     return;
    }
    let temp_user = await this.checkUserCredentials(token);
    if (temp_user == null || temp_user == undefined || !tokenManager.validateToken(temp_user, token))
    {
     socketLoggedIn = false;
     user = null;
     client.disconnect(true);
     return;
    }

    socketLoggedIn = true;
    user = temp_user;
    console.log('authenticated');
    if (user.group.name === YOLO_GROUP_NAME)
    {
     client.join('yolo');
     client.on('detection', async arrayOfDetections =>
     {
      try
      {
       this.handleNewDetections(arrayOfDetections).then(detection =>
       {
        client.broadcast.to(USER_ROOM).emit('detection', detection);
       });
      }
      catch (error)
      {
       console.error('[socket-helper] [detection] ' + error);
      }
     });
    }
    else
    {
     client.join(USER_ROOM);
    }
   });

   client.on('disconnect', () =>
   {
    console.log('disconnected');
    client.disconnect(false);
   });
  });
  server.listen(config.socketPort);
 }

 async checkUserCredentials(token: string): Promise<User>
 {
  if (token == null || token == undefined || token.trim().length < 1)
  {
   return null;
  }

  return await getConnection().getCustomRepository(UserRepository).findByToken(token);
 }

 async handleNewDetections(detectionsArray)
 {
  try
  {
   let detection = new Detection();
   detection.date = moment().toDate();
   let detectableObjectRepository = getConnection()
    .getCustomRepository(DetectableObjectRepository);

   let promises = <Promise<DetectionObject>[]> detectionsArray.map(
    async (detectionObjectReceived): Promise<DetectionObject> =>
    {

     let detectionObject = new DetectionObject();

     detectionObject.object = await detectableObjectRepository
      .findByName(detectionObjectReceived.className);

     if (detectionObject.object == undefined)
     {
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
   detection.detectionObjects = Promise.resolve(Promise.all(promises));
   await getConnection().getRepository(Detection).save(detection);
   return detection;
  }
  catch (e)
  {
   console.error(e);
  }

 }
}