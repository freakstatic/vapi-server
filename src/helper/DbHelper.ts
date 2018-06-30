import * as bcrypt from 'bcrypt';
import "reflect-metadata";
import {createConnection, getConnection, getConnectionOptions} from "typeorm";
import {Connection} from "typeorm/connection/Connection";
import {CustomNamingStrategy} from "../custom-naming-strategy";
import {User} from "../entity/User";
import {UserGroup} from "../entity/UserGroup";
import {DetectableObject} from "../entity/DetectableObject";
import {TimelapseScheduleOption} from "../entity/TimelapseScheduleOption";

export class DbHelper {
    constructor() {

    }

    static async fillWithDummyValues() {
        let userGroup = new UserGroup();
        ['admin', 'user', 'yolo'].forEach(async (groupName) => {
            userGroup.name = groupName;
            await getConnection().getRepository(UserGroup).insert(userGroup);
        });

        let user = new User();
        user.username = "test";
        user.password = await bcrypt.hash("test", 10);
        user.group = new UserGroup();
        user.group.id = 1;
        let yolo = new User();
        yolo.username = "yolo";
        yolo.password = await bcrypt.hash("yolo", 10);
        yolo.group = await getConnection().getRepository(UserGroup).findOne({where: {name: "yolo"}});
        await getConnection().getRepository(User).insert(user);
        await getConnection().getRepository(User).insert(yolo);

        ['person', 'car', 'cat', 'dog'].forEach((objectName) => {
            let detectableObject = new DetectableObject();
            detectableObject.name = objectName;
            getConnection().getRepository(DetectableObject).insert(detectableObject);
        });

        let timelapseScheduleOptionRepository = getConnection().getRepository(TimelapseScheduleOption);

        let daily = new TimelapseScheduleOption();
        daily.name = 'DAILY';
        daily.cronFormat = '0 0 0 * * *';
        timelapseScheduleOptionRepository.insert(daily);

        let weekly = new TimelapseScheduleOption();
        weekly.name = 'WEEKLY';
        weekly.cronFormat = '0 0 1 * * 0';
        timelapseScheduleOptionRepository.insert(weekly);

        let monthly = new TimelapseScheduleOption();
        monthly.name = 'MONTHLY';
        monthly.cronFormat = '0 0 2 1 * *';
        timelapseScheduleOptionRepository.insert(monthly);
    }

    static async isDBEmpty(): Promise<boolean> {
        let nrOfUsers = await getConnection().getRepository(User).count();
        return nrOfUsers == 0;
    }

    connect() {
        return new Promise<Connection>(async (resolve, reject) => {

            try {
                let connection = await getConnectionOptions().then(async (connectionOptions : any) => {
                    return createConnection(Object.assign(connectionOptions, {
                        namingStrategy: new CustomNamingStrategy()
                    }))
                });

                if (await DbHelper.isDBEmpty()) {
                    console.log('[DBHelper] Empty database detected, filling with dummy values');
                    await DbHelper.fillWithDummyValues();
                }
                resolve(connection);
            }
            catch (error) {
                reject(error);
                console.log(error)
            }
        });
    }


}