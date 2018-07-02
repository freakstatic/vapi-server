import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {User} from '../objects/user';
import {Group} from '../objects/group';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserListService
{
 constructor(private http: HttpClient)
 {
  this._users = new BehaviorSubject<User[]>(null);
  this._groups = new BehaviorSubject<Group[]>(null);
 }

 private _users: BehaviorSubject<User[]>;
 
 public get users(): Observable<User[]>
 {
  return this._users.asObservable();
 }
 
 private _groups: BehaviorSubject<Group[]>;
 
 public get groups(): Observable<Group[]>
 {
  return this._groups.asObservable();
 }
 
 public getUsers()
 {
  this.http.get('api/users')
   .subscribe((data: any) =>
   {
    if (data === undefined || data === null)
    {
     return;
    }
    const users: User[] = [];
    for (const tempUser of data)
    {
     const _user = User.Instance(tempUser);
     if (data === undefined || data === null)
     {
      continue;
     }
     users.push(_user);
    }
    if (users.length > 0)
    {
     this._users.next(users);
    }
   });
 }
 
 public getGroups()
 {
  this.http.get('api/groups')
   .subscribe((data: any) =>
   {
    if (data === undefined || data === null)
    {
     return;
    }
    const groups: Group[] = [];
    for (const tempGroup of data)
    {
     const _group = Group.Instance(tempGroup);
     if (data === undefined || data === null)
     {
      continue;
     }
     groups.push(_group);
    }
    if (groups.length > 0)
    {
     this._groups.next(groups);
    }
   });
 }
 
 public postUser(user:User):Promise<boolean>
 {
  return new Promise<boolean>((resolve,reject)=>
  {
   this.http.post('api/users',user).subscribe((obj:any) =>
   {
    if(obj.insertedId===undefined||obj.insertedId===null)
    {
     reject();
     return;
    }
    user.id=obj.insertedId;
    const users=this._users.getValue();
    users.push(user);
    this._users.next(users);
    resolve();
   },(error:any)=>
   {
    reject(error);
   });
  });
 }
 
 public putUser(user:User):Promise<boolean>
 {
  return new Promise<boolean>((resolve,reject)=>
  {
   this.http.put('api/users',user).subscribe(() =>
   {
    const users=this._users.getValue();
    const index=users.findIndex((userElement:User)=>
    {
     return user.id===userElement.id;
    });
    if(index===-1)
    {
     reject();
     return;
    }
    user.password=null;
    users[index]=user;
    this._users.next(users);
    resolve();
   },(error:any)=>
   {
    reject(error);
   });
  });
 }
 
 public deleteUser(user:User):Promise<boolean>
 {
  return new Promise<boolean>((resolve,reject)=>
  {
   this.http.delete('api/users/'+user.id).subscribe(() =>
   {
    const users=this._users.getValue().filter((userElement:User)=>
    {
     if(userElement.id!==user.id)
     {
      return true;
     }
     if(userElement.username!==user.username)
     {
      return true;
     }
     if(userElement.email!==user.email)
     {
      return true;
     }
     if(userElement.groupId!==user.groupId)
     {
      return true;
     }
     return false;
    });
    this._users.next(users);
    resolve();
   },(error:any)=>
   {
    reject(error);
   });
  });
 }
}
