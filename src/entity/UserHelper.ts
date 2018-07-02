import {User} from './User';
import * as bcrypt from 'bcrypt';
import {UserGroup} from './UserGroup';

export class UserHelper
{
 public static async CreateIntance(data: any): User
 {
  if (data === undefined || data === null)
  {
   return null;
  }
  if (!data.hasOwnProperty('username') || !data.hasOwnProperty('password') || !data.hasOwnProperty('groupId'))
  {
   return null;
  }
  
  const user = new User();
  user.username = data.username;
  user.password = await bcrypt.hash(data.password, 10);
  user.group = new UserGroup();
  user.group.id = data.groupId;
  
  return user;
 }
 
 public static async UpdateIntance(data: any): User
 {
  if (data === undefined || data === null)
  {
   return null;
  }
  
  const user = new User();
  
  if (!data.hasOwnProperty('username'))
  {
   user.username = data.username;
  }
  
  if (!data.hasOwnProperty('password'))
  {
   user.password = await bcrypt.hash(data.password, 10);
  }
  
  if (!data.hasOwnProperty('groupId'))
  {
   user.group = new UserGroup();
   user.group.id = data.groupId;
  }
  
  return user;
 }
}