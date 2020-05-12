import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UsersComponent implements OnInit {

  schoolObj: any = {};
  isNew
  manageSchoolHeading
  animal: string;
  name: string;
  closeResult;
  users: any = [];
  deletionSchool: any;
  organisations: any = [];
  departments: any = [];

  constructor(public dialog: MatDialog, private modalService: NgbModal, private translate: TranslateService,
    private usersService: UserService,
    private toastr: ToastrService
  ) {
    translate.setDefaultLang('en');
  }


  open(content, type: boolean, user?) {
    this.isNew = type;
    this.manageSchoolHeading = this.isNew
      ? "Create SMS user"
      : "Update SMS user";
    if (this.isNew) {
      this.clearSchool();
      if (this.organisations.length > 0)
        this.schoolObj["organizationId"] = this.organisations[0].id;

      if (this.departments.length > 0)
        this.schoolObj["departmentId"] = this.departments[0].departmentId;
    } else {
      this.updateSchoolFields(user);
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "my-class"
      })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  ngOnInit() {
    this.loadSchools();
  }

  updateSchoolFields(user) {
    this.schoolObj["schoolId"] = user.schoolId;
    this.schoolObj["schoolNameAr"] = user.schoolNameAr;
    this.schoolObj["schoolNameEng"] = user.schoolNameEng;
    this.schoolObj["organizationId"] = user.organizationId;
    this.schoolObj["departmentId"] = user.departmentId;
    this.schoolObj["recordStatus"] = user.recordStatus;

  }

  clearSchool() {
    this.schoolObj["schoolId"] = '';
    this.schoolObj["schoolNameAr"] = '';
    this.schoolObj["schoolNameEng"] = '';
    this.schoolObj["organizationId"] = '';
    this.schoolObj["recordStatus"] = '';
    this.schoolObj["departmentId"] = '';
  }


  openDelete(deleteConfirm, user) {
    this.deletionSchool = user;
    this.modalService
      .open(deleteConfirm, {
        ariaLabelledBy: "modal-basic-title"
      })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  onDeleteConfirmation() {
    // this.schoolService.deleteSchool(this.deletionSchool.schoolId).subscribe(
    //   (data: any) => {
    //     this.loadSchools();
    //     this.modalService.dismissAll("on fail");
    //     this.toastr.success('User Deleted', 'Success');
    //   },
    //   error => {
    //     this.modalService.dismissAll("on fail");
    //   }
    // );
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadSchools() {
    this.usersService.getAllUsers().subscribe(
      data => {
        this.users = data;
      },
      error => { }
    );
  }

  saveOrUpdate() {
    if (this.schoolObj['organizationId'] == null || this.schoolObj['organizationId'] == undefined) {
      this.toastr.error('Organisation is mandotary to save', 'Error');
      return;
    }

    if (this.schoolObj['departmentId'] == null || this.schoolObj['departmentId'] == undefined) {
      this.toastr.error('Department is mandotary to save', 'Error');
      return;
    }

    this.schoolObj['recordStatus'] = 1;
    // this.schoolService.createSchool(this.schoolObj).subscribe(
    //   (data: any) => {
    //     console.log(data);
    //     this.modalService.dismissAll("on success");
    //     this.toastr.success('user created/updated', 'Success');
    //     this.loadSchools();
    //   },
    //   (error: any) => {
    //     console.log(error);
    //     this.modalService.dismissAll("on fail");
    //     this.toastr.error('Error in creating user', 'Error');
    //   }
    // );
  }
}