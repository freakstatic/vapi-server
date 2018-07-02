import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../objects/user';
import {UserListService} from './user-list.service';
import {Group} from '../objects/group';
import {MatDialog, MatDialogRef} from '@angular/material';
import {UserDetailsModalComponent} from '../user-details-modal/user-details-modal.component';

@Component({
 selector: 'app-user-list',
 templateUrl: './user-list.component.html',
 styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit
{
 public users:Observable<User[]>;
 public groups:Observable<Group[]>;
 
 constructor(private userListService:UserListService,private dialog:MatDialog)
 {
  this.users=this.userListService.users;
  this.groups=this.userListService.groups;
 }
 
 ngOnInit()
 {
  this.userListService.getUsers();
  this.userListService.getGroups();
 }
 
 public addNewUser()
 {
  const dialogRef=this.openUserDialog(null);
  dialogRef.afterClosed().subscribe((result:User|boolean|undefined) => {
   if(!result)
   {
    return;
   }
   this.userListService.postUser(result);
  });
 }
 
 public updateUser(user:User)
 {
  const userClone:User=JSON.parse(JSON.stringify(user));
  const dialogRef=this.openUserDialog(userClone);
  dialogRef.afterClosed().subscribe((result:User|boolean|undefined) => {
   if(!result)
   {
    return;
   }
   this.userListService.putUser(result);
  });
 }
 
 public deleteUser(user:User)
 {
  this.userListService.deleteUser(user);
 }
 
 private openUserDialog(data?:User):MatDialogRef<UserDetailsModalComponent>
 {
  return this.dialog.open(UserDetailsModalComponent, {
   width: '750px',
   height: '550px',
   data:data
  });
 }
}
