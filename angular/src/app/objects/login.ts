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
  if(this.token==null||this.token==undefined||this.token.trim().length<1)
  {
   return;
  }
  let obj=JSON.parse(atob(token));
  this.userID=obj.userID;
  this.groupID=obj.groupID;
  this.username=obj.username;
  this.timestamp=new Date(obj.timestamp);
 }

 isValid():boolean
 {
  if(this.token==null||this.token==undefined||this.token.trim().length<1)
  {
   return false;
  }
  let date = new Date();
  return this.timestamp.getTime() > date.getTime();
 }
}