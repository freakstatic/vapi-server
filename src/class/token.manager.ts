import {User} from '../entity/User';

export class TokenManager
{
 public computeFromUser(user: User): string
 {
  if (this.validateToken(user, user.token))
  {
   return user.token;
  }
  let obj = {};
  let date = new Date();
  date.setDate(date.getDate() + 1);
  obj['userID'] = user.id;
  obj['username'] = user.username;
  obj['groupID'] = user.group.id;
  obj['timestamp'] = date.toUTCString();
  let token = Buffer.from(JSON.stringify(obj)).toString('base64');

  if(!this.validateToken(user,token))
  {
   return null;
  }

  return token;
 }

 public validateToken(user: User, token: string): boolean
 {
  if (token == null || token == undefined || token.trim().length < 1)
  {
   return false;
  }
  let obj = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
  let timestamp = new Date(obj.timestamp);
  let currentTime = new Date();
  if (currentTime.getTime() >= timestamp.getTime())
  {
   return false;
  }
  if (user.id != obj.userID)
  {
   return false;
  }
  if (user.group.id != obj.groupID)
  {
   return false;
  }
  if (user.username != obj.username)
  {
   return false;
  }
  return true;
 }
}