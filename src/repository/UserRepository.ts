import {EntityRepository, Repository} from 'typeorm';
import {User} from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User>
{
 async findByUsername(username: string):Promise<User>
 {
  return this.createQueryBuilder("user")
   .where("user.username = :username", {username})
   .leftJoinAndSelect("user.group", "userGroup")
   .getOne();
 }

 async findByToken(token: string):Promise<User>
 {
  return this.createQueryBuilder("user")
   .where("user.token = :token", {token})
   .leftJoinAndSelect("user.group", "userGroup")
   .getOne();
 }
 
 async getAllWithoutPassword():Promise<User[]>
 {
  return this.createQueryBuilder("user")
   .select(['id','username','password','email','userGroupId'])
   .getMany();
 }
}
