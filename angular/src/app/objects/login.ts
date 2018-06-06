export class Login
{
 userID: number;
 groupID: string;
 username: string;
 timestamp: Date;
 token: string;

 constructor(token: string)
 {
  this.token = token;
  let obj=JSON.parse(atob(token));
  this.userID=obj.userID;
  this.groupID=obj.groupID;
  this.username=obj.username;
  this.timestamp=new Date(obj.timestamp);
 }

 isValid():boolean
 {
  let date = new Date();
  return this.timestamp.getTime() > date.getTime();
 }
}