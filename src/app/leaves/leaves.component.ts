import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SchoolService } from '../schools/school.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LeavesService } from './leaves.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  isNew: boolean = true;
  manageLeavesHeading: string;
  closeResult;
  leaves: any = [];
  users: any = [];
  schools: any = [];
  deletionleave: any;


  leavesGroup: FormGroup;

  constructor(public dialog: MatDialog,
    private modalService: NgbModal,
    private translate: TranslateService,
    private leavesService: LeavesService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private userService: UserService

  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.getUsers();
    this.getSchools();
    this.leavesGroup = this.fb.group({
      leaveId: [null],
      leaveDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      schoolIdno: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      createdBy: ['', Validators.required],
      createdDate: ['', Validators.required],

    });
    this.loadLeaves();
  }

  getSchools() {
    this.schoolService.getAllSchools().subscribe(
      data => {
        this.schools = data;
      },
      error => {
      }
    );
  }
  getUsers() {

    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
      }
    );
  }


  loadLeaves() {
    this.spinner.show();
    this.leavesService.getAllLeaves().subscribe(
      data => {
        this.spinner.hide();
        this.leaves = data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  saveOrUpdate() {
    console.log(this.leavesGroup.value);
    if (this.isNew) {
      this.leavesService.createLeave(this.leavesGroup.value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('Leave created', 'Success');
          this.loadLeaves();
          this.leavesGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in creating Leave', 'Error');
        }
      );
    } else {
      this.leavesService.updateLeave(this.leavesGroup.value, this.leavesGroup.get('leaveId').value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('Leave updated', 'Success');
          this.loadLeaves();
          this.leavesGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in updating Leave', 'Error');
        }
      );
    }
  }

  openDelete(deleteConfirm, leave) {
    this.deletionleave = leave;
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
    this.leavesService.deleteLeave(this.deletionleave.leaveId).subscribe(
      (data: any) => {
        this.loadLeaves();
        this.modalService.dismissAll("on fail");
        this.toastr.success('Leave Deleted', 'Success');
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

  open(content, type: boolean, leave?) {
    this.isNew = type;
    this.manageLeavesHeading = this.isNew
      ? "Create Leave"
      : "Update Leave";
    if (this.isNew) {
      this.leavesGroup.reset();
    } else {
      this.leavesGroup.patchValue(leave, { onlySelf: true });
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
        }
      );
  }

}
