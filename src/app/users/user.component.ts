import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { CommonService } from '../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from '../schools/school.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UsersComponent implements OnInit {

  schoolObj: any = {};
  isNew: boolean;
  manageUserHeading: string;
  closeResult;
  users: any = [];
  deletionUser: any;
  typeValues: any = [];
  Gender: any = [];
  SchoolsList: any = [];
  selectedFiles: FileList;
  currentFileUpload: File;

  userGroup: FormGroup;
  constructor(public dialog: MatDialog,
    private modalService: NgbModal,
    private translate: TranslateService,
    private usersService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private schoolservice:SchoolService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.typeValues = this.commonService.getCommonValue('UserCategory', '');
    this.Gender = this.commonService.getCommonValue('Gender', '');
    this.getSchools();
    console.log(this.typeValues);
    this.userGroup = this.fb.group({
      userId: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      genderId: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      roles: ['', Validators.required],
      permissions: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      joiningDate: ['', Validators.required],
      endingDate: ['', Validators.required],
      schoolId: ['', Validators.required],
      categoryId: ['', Validators.required],
      createdBy: ['', Validators.required],
      createdDate: ['', Validators.required],
      address: this.fb.group({
        houseNum: ['', [Validators.required]],
        street: ['', Validators.required],
        village: ['', Validators.required],
        landmark: ['', Validators.required],
        mandal: ['', Validators.required],
        district: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', Validators.required],
        createdBy: ['', Validators.required],
        createdDate: ['', Validators.required]
      })
    });
    this.loadUsers();
  }
getSchools(){
  this.schoolservice.getAllSchools().subscribe(
    data => {
    
      this.SchoolsList = data;
    },
    error => {
      this.spinner.hide();
    }
  );
}
  loadUsers() {
    this.spinner.show();
    this.usersService.getAllUsers().subscribe(
      data => {
        this.spinner.hide();
        this.users = data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  saveOrUpdate() {
    console.log(this.userGroup.value);
    this.usersService.createUser(this.userGroup.value).subscribe(
      (data: any) => {
        console.log(data);
        this.modalService.dismissAll("on success");
        this.toastr.success('user created/updated', 'Success');
        this.loadUsers();
        this.userGroup.reset();
      },
      (error: any) => {
        console.log(error);
        this.modalService.dismissAll("on fail");
        this.toastr.error('Error in creating user', 'Error');
      }
    );
  }

  openDelete(deleteConfirm, user) {
    this.deletionUser = user;
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

  onDeleteConfirmation() {
    this.usersService.deleteUser(this.deletionUser.userId).subscribe(
      (data: any) => {
        this.loadUsers();
        this.modalService.dismissAll("on fail");
        this.toastr.success('User Deleted', 'Success');
      },
      error => {
        this.modalService.dismissAll("on fail");
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

  open(content, type: boolean, user?) {
    this.isNew = type;
    this.manageUserHeading = this.isNew
      ? "Create User"
      : "Update User";
    if (this.isNew) {

    } else {
      this.userGroup.patchValue(user, { onlySelf: true });
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

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    this.usersService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.toastr.success('file upload successfully', 'Success');
      }
      this.loadUsers();
    });
    this.selectedFiles = undefined;
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
}