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
}
