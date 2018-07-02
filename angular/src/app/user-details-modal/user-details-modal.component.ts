import {Component, Inject, OnInit} from '@angular/core';
import {User} from '../objects/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {UserListService} from '../user-list/user-list.service';
import {Observable} from 'rxjs/Observable';
import {Group} from '../objects/group';

@Component({
 selector: 'app-user-details-modal',
 templateUrl: './user-details-modal.component.html',
 styleUrls: ['./user-details-modal.component.scss']
})
export class UserDetailsModalComponent implements OnInit
{
 public groupID:string;
 public groups:Observable<Group[]>;
 private emailValidator:FormControl;
 
 constructor(public dialogRef: MatDialogRef<UserDetailsModalComponent>,private userService:UserListService, @Inject(MAT_DIALOG_DATA) public user: User)
 {
  if (this.user === undefined || this.user === null)
  {
   this.user = new User();
  }
  if(this.user.groupId===undefined||this.user.groupId===null)
  {
   this.groupID='0';
  }
  else
  {
   this.groupID=this.user.groupId.toString(10);
  }
  this.groups=this.userService.groups;
  this.emailValidator=new FormControl(this.user.email,[Validators.email]);
 }
 
 ngOnInit()
 {
 }
 
 public closeModalOnSave()
 {
  if(this.emailValidator.invalid)
  {
   return;
  }
  this.user.groupId=parseInt(this.groupID,10);
  this.dialogRef.close(this.user);
 }
 
 getEmailErrorMessage()
 {
  return this.emailValidator.hasError('required') ? 'Email is invalid' :'';
 }
}