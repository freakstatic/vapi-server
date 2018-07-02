import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../objects/user';
import {UserListService} from './user-list.service';
import {Group} from '../objects/group';
import {MatDialog, MatDialogRef} from '@angular/material';
import {UserDetailsModalComponent} from '../user-details-modal/user-details-modal.component';
import {TranslateService} from '@ngx-translate/core';
import {NavbarComponent} from '../components/navbar/navbar.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit
{
    param = {value: 'world'};
    public users: Observable<User[]>;
    public groups: Observable<Group[]>;

    constructor(private userListService: UserListService, private translateService: TranslateService, private dialog: MatDialog)
    {
        this.users = this.userListService.users;
        this.groups = this.userListService.groups;
    }

    ngOnInit()
    {
        this.userListService.getUsers();
        this.userListService.getGroups();
    }

    public addNewUser()
    {
        const dialogRef = this.openUserDialog(null);
        dialogRef.afterClosed().subscribe((result: User | boolean | undefined) =>
        {
            if (result === undefined || result == null || !result)
            {
                return;
            }
            const aUser = result as User;
            this.userListService.postUser(aUser)
                .then(() =>
                {
                    this.translateService.get('USER_CREATED').subscribe((res: string) =>
                    {
                        NavbarComponent.showMessage(res);
                    });
                })
                .catch((error)=>
                {
                    this.translateService.get('USER_NOT_CREATED').subscribe((res: string) =>
                    {
                        NavbarComponent.showMessage(res);
                    });
                });
        });
    }

    public updateUser(user: User)
    {
        const userClone: User = JSON.parse(JSON.stringify(user));
        const dialogRef = this.openUserDialog(userClone);
        dialogRef.afterClosed().subscribe((result: User | boolean | undefined) =>
        {
            if (result === undefined || result == null || !result)
            {
                return;
            }
            const aUser = result as User;
            this.userListService.putUser(aUser)
                .then(() =>
                {
                    this.translateService.get('USER_UPDATED').subscribe((res: string) =>
                    {
                        NavbarComponent.showMessage(res);
                    });
                })
                .catch((error)=>
                {
                    this.translateService.get('USER_NOT_UPDATED').subscribe((res: string) =>
                    {
                        NavbarComponent.showMessage(res);
                    });
                });
        });
    }

    public deleteUser(user: User)
    {
        this.userListService.deleteUser(user)
            .then(() =>
            {
                this.translateService.get('USER_DELETED').subscribe((res: string) =>
                {
                    NavbarComponent.showMessage(res);
                });
            })
            .catch((error)=>
            {
                this.translateService.get('USER_NOT_DELETED').subscribe((res: string) =>
                {
                    NavbarComponent.showMessage(res);
                });
            });
    }

    private openUserDialog(data?: User): MatDialogRef<UserDetailsModalComponent>
    {
        return this.dialog.open(UserDetailsModalComponent, {
            width: '750px',
            height: '550px',
            data: data
        });
    }
}
