import {SocketHelper} from "./helper/socket-helper"
import {WebServerHelper} from "./helper/web-server-helper";
import {DbHelper} from "./helper/db-helper";
import {MotionHelper} from "./helper/motion-helper";
import {TimelapseHelper} from "./helper/TimelapseHelper";
import {DetectionHelper} from "./helper/DetectionHelper";


let dbHelper = new DbHelper();

(async () => {
    await dbHelper.connect();
    let detectionHelper = new DetectionHelper();
    await detectionHelper.fixUnfishedEvents();
    let socketHelper = new SocketHelper(detectionHelper);
    let motionHelper = new MotionHelper();
    await TimelapseHelper.createFolders();
    let webSocketHelper = new WebServerHelper(motionHelper);
})();





