import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from '../schools/school.service';
import { HomeworkService } from './homework.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit {
  
  classes: any = [];
  subjects: any = [];
  sections: any = [];
  schoolsList: any = [];
  homeworklist: any = [];
  isNew: boolean = true;
  homeworkGroup: FormGroup;
  deletionHomework: any;
  closeResult;
  manageUserHeading: string;
 

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

  constructor(
    public dialog: MatDialog,
    private modalService: NgbModal,
    private translate: TranslateService,
    private homeworkService: HomeworkService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private schoolservice: SchoolService
  ) { }

  ngOnInit() {
    this.classes = this.commonService.getCommonValue('CLASS', '');
    this.subjects = this.commonService.getCommonValue('SubjectCatagory', '');
    this.sections = this.commonService.getCommonValue('SECTION', '');
    this.getSchools();
    this.homeworkGroup = this.fb.group({
      homeWorkId: [null],
      description: ['', Validators.required],
      homeWorkDate: ['', Validators.required],
      schoolIdno: ['', Validators.required],
      classId: ['', Validators.required],
      subjectId: ['', Validators.required],
      sectionId: ['', Validators.required],
      createdBy: ['', Validators.required],
      createdDate: ['', Validators.required]
    });
    this.loadAllHomeWorks();
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

  loadAllHomeWorks() {
    this.spinner.show();
    this.homeworkService.getAllHomeWorks().subscribe(
      data => {
        this.spinner.hide();
        this.homeworklist = data;
      },
      error => {
        this.spinner.hide();
      }
    )
  }
  saveOrUpdate() {
    console.log(this.homeworkGroup.value);
    if (this.isNew) {
      this.homeworkService.createHomeWork(this.homeworkGroup.value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('homwork created/updated', 'Success');
          this.loadAllHomeWorks();
          this.homeworkGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in creating homwork', 'Error');
        }
      );
    } else {
      this.homeworkService.updateHomeWork(this.homeworkGroup.value, this.homeworkGroup.get('homeWorkId').value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('homwork created/updated', 'Success');
          this.loadAllHomeWorks();
          this.homeworkGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in creating homwork', 'Error');
        }
      );
    }
    
  }

  openDelete(deleteConfirm, homework) {
    this.deletionHomework = homework;
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
    this.homeworkService.deleteHomeWork(this.deletionHomework.homeWorkId).subscribe(
      (data: any) => {
        this.loadAllHomeWorks;
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

  open(content, type: boolean, homework?) {
    this.isNew = type;
    this.manageUserHeading = this.isNew
      ? "Create HomeWork"
      : "Update HomeWork";
    if (this.isNew) {

    } else {
      this.homeworkGroup.patchValue(homework, { onlySelf: true });
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