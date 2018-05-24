import * as bcrypt from 'bcrypt';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as passport from "passport";
import {BasicStrategy} from 'passport-http';
import {Strategy} from 'passport-http-bearer';
import * as path from 'path';
import {getConnection} from "typeorm";
import {ErrorObject} from "../class/ErrorObject";
import {User} from '../entity/User';
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

  passport.use(new BasicStrategy((username: string, password: string, done: any) =>
  {
   if (username == undefined || username.trim().length == 0)
   {
    done(new ErrorObject(ErrorObject.EMPTY_USERNAME));
    return;
   }

   if (password == undefined || password.trim().length == 0)
   {
    done(new ErrorObject(ErrorObject.EMPTY_PASSWORD));
    return;
   }

   let user = null;
   getConnection().getCustomRepository(UserRepository).findByUsername(username)
    .then(user =>
    {
     if (user == null || user == undefined)
     {
      done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
      return;
     }

     bcrypt.compare(password, user.password)
      .then(matches =>
      {
       if (!matches)
       {
        done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
        return;
       }
       done(null, user);
      });
    })
    .catch(reason =>
    {
     done(reason);
    });
  }));

  passport.use(new Strategy((token: string, done: any) =>
  {
   if (token == 'test')
   {
    done(null, "test");
   }
   done(null, false);
   console.log('teste');
  }));

  passport.serializeUser((user: User, done) =>
  {
   if (user == null || user == undefined)
   {
    done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
    return;
   }

   if (user.id == null || user.id == undefined)
   {
    done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
    return;
   }

   done(null, user.id);
  });

  passport.deserializeUser((id, done) =>
  {
   if (id == null || id == undefined)
   {
    done(new ErrorObject(ErrorObject.EMPTY_USER_ID));
    return;
   }

   getConnection().getCustomRepository(UserRepository).findOne(id)
    .then((user) =>
    {
     if (user == null || user == undefined)
     {
      done(new ErrorObject(ErrorObject.INVALID_USERNAME_OR_PASSWORD));
      return;
     }
     done(null, user);
    });
  });

  //app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true, type: 'application/json'}));
  app.use(express.static(__dirname + '/../angular/dist/'));
  app.use(passport.initialize());

  app.post(API_URL + 'login', passport.authenticate('basic', {
   session: false,
   failureFlash: false
  }), (req, res) =>
  {
   res.sendStatus(200).send();
   return;
  });

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


  app.get(API_URL + 'login/check', passport.authenticate('bearer', {
   session: false,
   failureFlash: false
  }), async (req: any, res, next) =>
  {
   res.status(200);
   res.send({isLoggedIn: true});
  });

  app.get(API_URL + 'detection', async (req: any, res, next) =>
  {
   let startDate = null;
   let endDate = null;
   if (req.query.startDate !== undefined && req.query.startDate !== null)
   {
    startDate = new Date(req.query.startDate);
   }
   if (req.query.endDate !== undefined && req.query.endDate !== null)
   {
    endDate = new Date(req.query.endDate);
   }
   let detections = await getConnection().getCustomRepository(DetectionRepository).get(startDate, endDate);
   res.status(200).send(detections);
  });

  app.get(API_URL + 'stats/detection', async (req: any, res, next) =>
  {
   let startDate = null;
   let endDate = null;
   if (req.query.startDate !== undefined && req.query.startDate !== null)
   {
    startDate = new Date(req.query.startDate);
   }
   if (req.query.endDate !== undefined && req.query.endDate !== null)
   {
    endDate = new Date(req.query.endDate);
   }
   let detections = await getConnection().getCustomRepository(DetectionRepository).getStats(startDate, endDate);
   if (detections == null)
   {
    res.status(204).send();
   }
   res.status(200).send(detections);
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