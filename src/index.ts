import {SocketHelper} from "./helper/SocketHelper"
import {WebServerHelper} from "./helper/WebServerHelper";
import {DbHelper} from "./helper/DbHelper";
import {MotionHelper} from "./helper/MotionHelper";
import {TimelapseHelper} from "./helper/TimelapseHelper";
import {DetectionHelper} from "./helper/DetectionHelper";
import {NotificationHelper} from "./helper/NotificationHelper";
import * as i18n from 'i18n';
import {TimelapseJobHelper} from "./helper/TimelapseJobHelper";

let translator = {} as any;
i18n.configure({
    locales: ['en', 'pt'],
    directory: __dirname + '/../locales',
    register: translator
});

let dbHelper = new DbHelper();

(async () => {
    await dbHelper.connect();
    let notificationHelper = new NotificationHelper(translator);
    let detectionHelper = new DetectionHelper(notificationHelper);
    await detectionHelper.fixUnfishedEvents();
    let motionHelper = new MotionHelper();
    await TimelapseHelper.createFolders();
    let timelapseJobHelper = new TimelapseJobHelper();
    let webServerHelper = new WebServerHelper(motionHelper, notificationHelper, timelapseJobHelper);
    let socketHelper = new SocketHelper(webServerHelper, detectionHelper, motionHelper);
})();





