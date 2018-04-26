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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const bcrypt = require("bcrypt");
const custom_naming_strategy_1 = require("./custom-naming-strategy");
const UserGroup_1 = require("./entity/UserGroup");
class DbHelper {
    constructor() {
    }
    connect() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let connection = yield typeorm_1.getConnectionOptions().then((connectionOptions) => __awaiter(this, void 0, void 0, function* () {
                    return typeorm_1.createConnection(Object.assign(connectionOptions, {
                        namingStrategy: new custom_naming_strategy_1.CustomNamingStrategy()
                    }));
                }));
                if (yield DbHelper.isDBEmpty()) {
                    console.log('[DBHelper] Empty database detected, filling with dummy values');
                    yield DbHelper.fillWithDummyValues();
                }
                resolve(connection);
            }
            catch (error) {
                reject(error);
                console.log(error);
            }
        }));
    }
    static fillWithDummyValues() {
        return __awaiter(this, void 0, void 0, function* () {
            let userGroup = new UserGroup_1.UserGroup();
            ['admin', 'user'].forEach((groupName) => __awaiter(this, void 0, void 0, function* () {
                userGroup.name = groupName;
                yield typeorm_1.getConnection().getRepository(UserGroup_1.UserGroup).insert(userGroup);
            }));
            let user = new User_1.User();
            user.username = "test";
            user.password = yield bcrypt.hash("test", 10);
            user.group = new UserGroup_1.UserGroup();
            user.group.id = 1;
            yield typeorm_1.getConnection().getRepository(User_1.User).insert(user);
        });
    }
    static isDBEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            let nrOfUsers = yield typeorm_1.getConnection().getRepository(User_1.User).count();
            return nrOfUsers == 0;
        });
    }
}
exports.DbHelper = DbHelper;
//# sourceMappingURL=db-helper.js.map