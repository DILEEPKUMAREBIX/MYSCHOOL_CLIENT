import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SchoolService } from './school.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { School } from '../shared/models/school.interface';
import { CommonService } from '../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  isNew: boolean;
  manageSchoolHeading: string;
  closeResult;
  schools: any = [];
  deletionSchool: any;
  typeValues: any = [];


  schoolGroup: FormGroup;

  constructor(public dialog: MatDialog, private modalService: NgbModal, private translate: TranslateService,
    private schoolService: SchoolService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.typeValues = this.commonService.getCommonValue('SCHTYPE', '');
    console.log(this.typeValues);
    this.schoolGroup = this.fb.group({
      schoolId: [null],
      name: ['', [Validators.required]],
      typeId: [0, [Validators.required]],
      anniversary: ['', [Validators.required]],
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
    this.loadSchools();
  }

  loadSchools() {
    this.spinner.show();
    this.schoolService.getAllSchools().subscribe(
      data => {
        this.spinner.hide();
        this.schools = data;
      },
      error => { 
        this.spinner.hide();
      }
    );
  }

  saveOrUpdate() {
    console.log(this.schoolGroup.value);
    this.schoolService.createSchool(this.schoolGroup.value).subscribe(
      (data: any) => {
        console.log(data);
        this.modalService.dismissAll("on success");
        this.toastr.success('school created/updated', 'Success');
        this.loadSchools();
        this.schoolGroup.reset();
      },
      (error: any) => {
        console.log(error);
        this.modalService.dismissAll("on fail");
        this.toastr.error('Error in creating school', 'Error');
      }
    );
  }

  openDelete(deleteConfirm, school) {
    this.deletionSchool = school;
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
    this.schoolService.deleteSchool(this.deletionSchool.schoolId).subscribe(
      (data: any) => {
        this.loadSchools();
        this.modalService.dismissAll("on fail");
        this.toastr.success('School Deleted', 'Success');
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

  open(content, type: boolean, school?) {
    this.isNew = type;
    this.manageSchoolHeading = this.isNew
      ? "Create School"
      : "Update School";
    if (this.isNew) {
      this.schoolGroup.reset();
    } else {
      this.schoolGroup.patchValue(school, { onlySelf: true });
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

}