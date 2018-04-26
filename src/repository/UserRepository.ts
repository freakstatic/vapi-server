import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async findByUsername(username: string) {
        return this.createQueryBuilder("user")
            .where("user.username = :username", { username })
            .leftJoinAndSelect("user.group", "userGroup")
            .getOne();
    }
}
