import {SocketHelper} from "./helper/socket-helper"
import {WebServerHelper} from "./helper/web-server-helper";
import {DbHelper} from "./helper/db-helper";
import {MotionHelper} from "./helper/motion-helper";

let dbHelper = new DbHelper();

(async () => {
    await dbHelper.connect();
    let socketHelper = new SocketHelper(dbHelper);
    let motionHelper = new MotionHelper();
    let webSocketHelper = new WebServerHelper(motionHelper);

})();





