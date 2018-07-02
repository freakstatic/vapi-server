import {Component, Inject, OnInit} from '@angular/core';
import {User} from '../objects/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
 selector: 'app-user-details-modal',
 templateUrl: './user-details-modal.component.html'
})
export class UserDetailsModalComponent implements OnInit
{
 constructor(public dialogRef: MatDialogRef<UserDetailsModalComponent>, @Inject(MAT_DIALOG_DATA) public user: User)
 {
  if(this.user===undefined||this.user===null)
  {
   this.user=new User();
  }
 }
 
 ngOnInit()
 {
 }
}
