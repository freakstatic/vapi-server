import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository()
export class UserRepository extends Repository<User> {

    findByUsername(username: string) {
        return this.createQueryBuilder("user")
            .where("user.username = :username", { username })
            .getOne();
    }

}
