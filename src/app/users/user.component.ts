import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UsersComponent implements OnInit {

  schoolObj: any = {};
  isNew: boolean = true;
  manageUserHeading: string;
  closeResult;
  users: any = [];
  deletionUser: any;
  typeValues: any = [];
  gender: any = [];
  schoolsList: any = [];
  casteList: any = [];
  religionList: any = [];
  selectedFile: any;
  file: File;
  userGroup: FormGroup;
  searchText;
  page: any = 1;
  pageSize: any = 5;
  collectionSize: any = 0;

  constructor(public dialog: MatDialog,
    private modalService: NgbModal,
    private translate: TranslateService,
    private usersService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private schoolservice: SchoolService,
    private route: ActivatedRoute, private router: Router
  ) {
    translate.setDefaultLang('en');

  }

  ngOnInit() {
    this.typeValues = this.commonService.getCommonValue('UserCategory', '');
    this.gender = this.commonService.getCommonValue('Gender', '');
    this.casteList = this.commonService.getCommonValue('Caste', '');
    this.religionList = this.commonService.getCommonValue('Religion', '');
    this.getSchools();
    this.collectionSize = this.users.length;
    this.userGroup = this.fb.group({
      userId: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      genderId: ['', Validators.required],
      religionId: ['', Validators.required],
      casteId: ['', Validators.required],
      idProof: ['', Validators.required],
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
        addressId: [],
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

  get userslist(): any[] {
    return this.users
      .map((userlist: any, i: any) => ({ id: i + 1, ...userlist }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  getSchools() {
    this.schoolservice.getAllSchools().subscribe(
      data => {
        this.schoolsList = data;
      },
      error => {
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
    if (this.isNew) {
      this.usersService.createUser(this.userGroup.value, this.selectedFile[0]).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('user created', 'Success');
          this.loadUsers();
          this.userGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in creating user', 'Error');
        }
      );
    } else {
      this.usersService.updateUser(this.userGroup.value, this.userGroup.get('userId').value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('user updated', 'Success');
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

  
  openUser(singleUser, user) {
    this.userGroup.patchValue(user, { onlySelf: true });
    this.modalService.open(singleUser, {
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
    this.selectedFile = event.target.files;
  }

  upload() {
    this.usersService.pushFileToStorage(this.selectedFile[0]).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.toastr.success('file upload successfully', 'Success');
      }
      this.loadUsers();
    });
    this.selectedFile = undefined;
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
}