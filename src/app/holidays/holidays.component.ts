import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HolidaysService } from './holidays.service';
import { SchoolService } from '../schools/school.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  isNew: boolean = true;
  manageHolidayHeading: string;
  closeResult;
  holidays: any = [];
  schools: any = [];
  deletionHoliday: any;

  
  holidayGroup: FormGroup;

  constructor(public dialog: MatDialog,
    private modalService: NgbModal,
    private translate: TranslateService,
    private holidayservice: HolidaysService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.getSchools();
    this.holidayGroup = this.fb.group({
      holidayId: [null],
      holidayDate: ['', [Validators.required]],
      description: [0, [Validators.required]],
      schoolIdno: ['', [Validators.required]],
      createdBy: ['', Validators.required],
      createdDate: ['', Validators.required]
    });
    this.loadHolidays();
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

  loadHolidays() {
    this.spinner.show();
    this.holidayservice.getAllHolidays().subscribe(
      data => {
        this.spinner.hide();
        this.holidays = data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  saveOrUpdate() {
    console.log(this.holidayGroup.value);
    if (this.isNew) {
      this.holidayservice.createHoliday(this.holidayGroup.value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('holiday created', 'Success');
          this.loadHolidays();
          this.holidayGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in creating holiday', 'Error');
        }
      );
    } else {
      this.holidayservice.updateHoliday(this.holidayGroup.value, this.holidayGroup.get('holidayId').value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('Holiday updated', 'Success');
          this.loadHolidays();
          this.holidayGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in updating Holiday', 'Error');
        }
      );
    }
  }

  openDelete(deleteConfirm, holiday) {
    this.deletionHoliday = holiday;
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
    this.holidayservice.deleteHoliday(this.deletionHoliday.holidayId).subscribe(
      (data: any) => {
        this.loadHolidays();
        this.modalService.dismissAll("on fail");
        this.toastr.success('Holiday Deleted', 'Success');
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

  open(content, type: boolean, holiday?) {
    this.isNew = type;
    this.manageHolidayHeading = this.isNew
      ? "Create Holiday"
      : "Update Holiday";
    if (this.isNew) {
      this.holidayGroup.reset();
    } else {
      this.holidayGroup.patchValue(holiday, { onlySelf: true });
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
