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
const socket_helper_1 = require("./helper/socket-helper");
const web_server_helper_1 = require("./helper/web-server-helper");
const db_helper_1 = require("./helper/db-helper");
const motion_helper_1 = require("./helper/motion-helper");
const TimelapseHelper_1 = require("./helper/TimelapseHelper");
let dbHelper = new db_helper_1.DbHelper();
(() => __awaiter(this, void 0, void 0, function* () {
    yield dbHelper.connect();
    let socketHelper = new socket_helper_1.SocketHelper(dbHelper);
    let motionHelper = new motion_helper_1.MotionHelper();
    let webSocketHelper = new web_server_helper_1.WebServerHelper(motionHelper);
    TimelapseHelper_1.TimelapseHelper.createFolders();
}))();
//# sourceMappingURL=index.js.map