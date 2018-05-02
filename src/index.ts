import {SocketHelper} from "./helper/socket-helper"
import {WebServerHelper} from "./helper/web-server-helper";
import {DbHelper} from "./helper/db-helper";

let dbHelper = new DbHelper();

(async () => {
    await dbHelper.connect();
    let socketHelper = new SocketHelper(dbHelper);
    let webSocketHelper = new WebServerHelper(dbHelper);
})();





