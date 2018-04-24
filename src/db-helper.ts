import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Connection} from "typeorm/connection/Connection";

export class DbHelper {
    constructor(){

    }

    connect(){
        return new Promise<Connection>((resolve, reject) => {
            createConnection().then(async connection => {
                console.log("Connected to database");
                resolve(connection);
            }).catch(error => {
                reject(error);
                console.log(error)
            } );
        });
    }

    fillWithDumpValues(){

    }
}