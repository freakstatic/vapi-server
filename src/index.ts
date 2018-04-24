import {SocketHelper} from "./socket-helper"
import {WebServerHelper} from "./web-server-helper";
import {DbHelper} from "./db-helper";

let dbHelper = new DbHelper();

(async () => {
    await dbHelper.connect();
    let socketHelper = new SocketHelper(dbHelper);
    let webSocketHelper = new WebServerHelper(dbHelper);
})();





