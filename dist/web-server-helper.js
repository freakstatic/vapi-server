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
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const typeorm_1 = require("typeorm");
const UserRepository_1 = require("./repository/UserRepository");
const bcrypt = require("bcrypt");
const error_object_1 = require("./error-object");
let config = require('../config.json');
class WebServerHelper {
    constructor(dbHelper) {
        const WEB_SERVER_PORT = 8080;
        const API_URL = '/api/';
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false, type: 'application/json' }));
        app.use(express.static(__dirname + '/../angular/dist/'));
        app.use(session({ secret: config.expressSecret, resave: true, saveUninitialized: true }));
        app.post(API_URL + 'login', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let receivedUsername = req.body.username;
            let receivedPassword = req.body.password;
            if (receivedUsername == undefined || receivedUsername.trim().length == 0) {
                res.status(400);
                res.send(new error_object_1.ErrorObject(error_object_1.ErrorObject.EMPTY_USERNAME));
                return next();
            }
            if (receivedPassword == undefined || receivedPassword.trim().length == 0) {
                res.status(400);
                res.send(new error_object_1.ErrorObject(error_object_1.ErrorObject.EMPTY_USERNAME));
                return next();
            }
            let user = yield typeorm_1.getConnection().getCustomRepository(UserRepository_1.UserRepository).findByUsername(receivedUsername);
            if (user == undefined) {
                res.status(400);
                res.send(new error_object_1.ErrorObject(error_object_1.ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                return next();
            }
            let matches = yield bcrypt.compare(receivedPassword, user.password);
            if (!matches) {
                res.status(400);
                res.send(new error_object_1.ErrorObject(error_object_1.ErrorObject.INVALID_USERNAME_OR_PASSWORD));
                return next();
            }
            req.session.userId = user.id;
            req.session.groupId = user.group.id;
            res.status(200);
            res.send({});
            return next();
        }));
        app.get(API_URL + 'login/check', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.status(200);
            if (req.session.userId) {
                res.send({ isLoggedIn: true });
            }
            else {
                res.send({ isLoggedIn: false });
            }
            return;
        }));
        app.get('*', function (req, res) {
            res.status(200)
                .sendFile(path.join(__dirname + '/../angular/dist/index.html'));
        });
        app.listen(WEB_SERVER_PORT);
        console.log('Started web server on ' + WEB_SERVER_PORT);
    }
    isAuthenticated(req, res, next) {
        if (req.session.userId) {
            return next();
        }
        res.status(403);
    }
}
exports.WebServerHelper = WebServerHelper;
//# sourceMappingURL=web-server-helper.js.map