import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SchoolService } from '../schools/school.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../shared/services/common.service';
import { ClassperiodService } from './classperiod.service';

@Component({
  selector: 'app-classperiod',
  templateUrl: './classperiod.component.html',
  styleUrls: ['./classperiod.component.css']
})
export class ClassperiodComponent implements OnInit {
  schools: any = [];
  periodlist: any = [];
  classlist: any = [];
  sectionlist: any = [];
  classpeiodslist: any = [];

  classperiodGroup: FormGroup;
  isNew: boolean;
  manageClassperiodHeading: string;
  closeResult: string;
  deletionClassperiod: any;
  

  constructor(public dialog: MatDialog,
    private modalService: NgbModal,
    private translate: TranslateService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private classperiodservice: ClassperiodService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.classlist = this.commonService.getCommonValue('CLASS', '');
    this.sectionlist = this.commonService.getCommonValue('SECTION', '');
    this.periodlist = this.commonService.getCommonValue('PERIODS', '');
    this.classperiodGroup = this.fb.group({
      classPeriodId: [null],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      periodIdno: ['', [Validators.required]],
      schoolIdno: ['', Validators.required],
      classId: ['', Validators.required],
      sectionId: ['', Validators.required],
      createdBy: ['', Validators.required],
      createdDate: ['', Validators.required]
    });
    this.getSchools();
    this.loadClasspeiods();
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

loadClasspeiods(){
  this.spinner.show();
  this.classperiodservice.getAllClassperiods().subscribe(
    data => {
      this.spinner.hide();
      this.classpeiodslist = data;
    },
    error => {
      this.spinner.hide();
    }
  );
}
  saveOrUpdate() {
    console.log(this.classperiodGroup.value);
    if (this.isNew) {
      this.classperiodservice.createClassperiod(this.classperiodGroup.value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('classperiod created', 'Success');
          this.loadClasspeiods();
          this.classperiodGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in creating classperiod', 'Error');
        }
      );
    } else {
      this.classperiodservice.updateClassperiod(this.classperiodGroup.value, this.classperiodGroup.get('classPeriodId').value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('classperiod updated', 'Success');
          this.loadClasspeiods();
          this.classperiodGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in updating classperiod', 'Error');
        }
      );
    }
  }

  openDelete(deleteConfirm, classperiod) {
    this.deletionClassperiod = classperiod;
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
    this.classperiodservice.deleteClassperiod(this.deletionClassperiod.classPeriodId).subscribe(
      (data: any) => {
        this.loadClasspeiods();
        this.modalService.dismissAll("on fail");
        this.toastr.success('classperiod Deleted', 'Success');
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

  open(content, type: boolean, classperiod?) {
    this.isNew = type;
    this.manageClassperiodHeading = this.isNew
      ? "Create Classperiod"
      : "Update Classperiod";
    if (this.isNew) {
      this.classperiodGroup.reset();
    } else {
      this.classperiodGroup.patchValue(classperiod, { onlySelf: true });
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
