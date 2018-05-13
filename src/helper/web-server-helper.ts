import * as bcrypt from 'bcrypt';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import {getConnection} from "typeorm";
import {ErrorObject} from "../class/ErrorObject";
import {MotionSettingsError} from "../exception/MotionSettingsError";
import {DetectionRepository} from '../repository/DetectionRepository';
import {UserRepository} from "../repository/UserRepository";
import {MotionHelper} from "./motion-helper";

let config = require('../../config.json');

export class WebServerHelper
{
 constructor(motionHelper: MotionHelper)
 {
  const WEB_SERVER_PORT = 8080;
  const API_URL = '/api/';

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false, type: 'application/json'}));
  app.use(express.static(__dirname + '/../angular/dist/'));
  app.use(session({secret: config.expressSecret, resave: true, saveUninitialized: true}));


  app.post(API_URL + 'login', async (req: any, res, next) =>
   {

    let receivedUsername = req.body.username;
    let receivedPassword = req.body.password;

    if (receivedUsername == undefined || receivedUsername.trim().length == 0)
    {
     res.status(400);
     res.send(new ErrorObject(ErrorObject.EMPTY_USERNAME));
     return next();
    }

    if (receivedPassword == undefined || receivedPassword.trim().length == 0)
    {
     res.status(400);
     res.send(new ErrorObject(ErrorObject.EMPTY_USERNAME));
     return next();
    }

    let user = await getConnection().getCustomRepository(UserRepository).findByUsername(receivedUsername);

    if (user == undefined)
    {
     res.status(400);
     res.send(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
     return next();
    }

    let matches = await bcrypt.compare(receivedPassword, user.password);
    if (!matches)
    {
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

  app.get(API_URL + 'motion/settings', async (req: any, res, next) =>
  {
   let settings = await motionHelper.settingsArray();
   res.status(200);
   res.send(settings);
  });
  app.post(API_URL + 'motion/settings/update', async (req: any, res, next) =>
  {
   let settings = req.body;
   try
   {
    await motionHelper.editSettings(settings);
    // res.status(200);
    res.send({});
   }
   catch (e)
   {
    if (e instanceof MotionSettingsError)
    {
     res.status(400);
     res.send(new ErrorObject(ErrorObject.MOTION_INVALID_SETTINGS));
    }
    else
    {
     res.status(500);
     res.send({});
    }
   }
  });


  app.get(API_URL + 'login/check', async (req: any, res, next) =>
  {
   res.status(200);
   if (req.session.userId)
   {
    res.send({isLoggedIn: true});
   }
   else
   {
    res.send({isLoggedIn: false});
   }
  });

  app.get(API_URL + 'detection', async (req: any, res, next) =>
  {
   let startDate=null;
   let endDate=null;
   if(req.query.startDate!==undefined&&req.query.startDate!==null)
   {
    startDate=new Date(req.query.startDate);
   }
   if(req.query.endDate!==undefined&&req.query.endDate!==null)
   {
    endDate=new Date(req.query.endDate);
   }
   let detections = await getConnection().getCustomRepository(DetectionRepository).get(startDate,endDate);
   res.status(200).send(detections);
   return next();
  });

  app.get('*', function (req, res)
  {
   res.status(200)
    .sendFile(path.join(__dirname + '/../angular/dist/index.html'));
  });

  app.listen(WEB_SERVER_PORT);
  console.log('Started web server on ' + WEB_SERVER_PORT);
 }


 isAuthenticated(req, res, next): boolean
 {

  if (req.session.userId)
  {
   return next();
  }
  res.status(403);
 }
}