export class User
{
 public id: number;
 public username: string;
 public email: string;
 public groupId: number;
 public password: string;
 
 public static Instance(data: any): User
 {
  if (!data.hasOwnProperty('id') || !data.hasOwnProperty('username') || !data.hasOwnProperty('email') || !data.hasOwnProperty('group_id'))
  {
   return null;
  }
  const user = new User();
  user.id = data.id;
  user.username = data.username;
  user.email = data.email;
  user.groupId = data.group_id;
  user.password = null;
  return user;
 }
}