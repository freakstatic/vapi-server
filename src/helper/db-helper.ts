import "reflect-metadata";
import {createConnection, getConnection, getConnectionOptions} from "typeorm";
import {User} from "../entity/User";
import {Connection} from "typeorm/connection/Connection";
import * as bcrypt from 'bcrypt';
import {CustomNamingStrategy} from "../custom-naming-strategy";
import {UserGroup} from "../entity/UserGroup";

export class DbHelper {
    constructor(){

    }

    connect(){
        return new Promise<Connection>(async(resolve, reject) => {

            try {
                let connection = await getConnectionOptions().then( async connectionOptions => {
                    return createConnection(Object.assign(connectionOptions, {
                        namingStrategy: new CustomNamingStrategy()
                    }))
                });

                if (await DbHelper.isDBEmpty()){
                    console.log('[DBHelper] Empty database detected, filling with dummy values');
                    await DbHelper.fillWithDummyValues();
                }
                resolve(connection);
            }catch (error) {
                reject(error);
                console.log(error)
            }
        });
    }

    static async fillWithDummyValues(){
        let userGroup = new UserGroup();
        ['admin', 'user'].forEach( async(groupName) => {
            userGroup.name = groupName;
            await getConnection().getRepository(UserGroup).insert(userGroup);
        });

        let user = new User();
        user.username = "test";
        user.password = await bcrypt.hash("test", 10);
        user.group = new UserGroup();
        user.group.id = 1;
        await getConnection().getRepository(User).insert(user);
    }

    static async isDBEmpty() : Promise<boolean>{
        let nrOfUsers = await getConnection().getRepository(User).count();
        return nrOfUsers == 0;
    }


}