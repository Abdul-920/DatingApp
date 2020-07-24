import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/Admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { NgxGalleryThumbnailsComponent } from 'ngx-gallery';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users;
    }, err => {
      console.log('errors');
    });
  }

  editRolesModal(userR: User) {
    console.log(userR);
    const initialState = {
      user: userR,
      roles: this.getRolesArray(userR)
    };

    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    // No inteelisense available here
    this.bsModalRef.content.updateSelectedRoles.subscribe((val) => {
      const rolesToUpdate = {
        roleNames: [...val.filter(el => el.checked === true).map(el => el.name)]
      };
      console.log(rolesToUpdate);
      if(rolesToUpdate) {
        console.log(userR);
       this.adminService.updateUserRoles(userR, rolesToUpdate).subscribe(()=> {
         userR.roles = [...rolesToUpdate.roleNames];
       }, err => {
         console.log(err);
       });
      }
    });
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'},
      {name: 'VIP', value: 'VIP'},
    ];

    // tslint:disable-next-line: prefer-for-of
    for(let i = 0 ; i< availableRoles.length; i++) {
      let isMatch = false;
      // tslint:disable-next-line: prefer-for-of
      for ( let j = 0; j<userRoles.length; j++ ) {
        if ( availableRoles[i].name === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked =true;
          roles.push(availableRoles[i]);
          break;
        }
      }
      if(!isMatch) {
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }
}
