"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("user")
                .where("user.username = :username", { username })
                .leftJoinAndSelect("user.group", "userGroup")
                .getOne();
        });
    }
    findByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("user")
                .where("user.token = :token", { token })
                .leftJoinAndSelect("user.group", "userGroup")
                .getOne();
        });
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(User_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map