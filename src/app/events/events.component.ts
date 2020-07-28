import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { NgbCarouselConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from '../schools/school.service';
import { CommonService } from '../shared/services/common.service';
import { data } from 'jquery';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  providers: [NgbCarouselConfig]
})
export class EventsComponent implements OnInit {
  folder: any;
  selectedFiles: any=[];
  currentFileUpload: File;
  currentfile: File;
  showNavigationArrows = true;
  showNavigationIndicators = true;
  manageeventHeading: any;
  hide: boolean = false;
  isSelected: boolean = true;
  idgeneration: any = 0;
  id: any = 0;
  isNew: boolean = true;
  images: any = [];
  schools: any = [];
  classes: any = [];
  sections: any = [];
  folders: any = [];
  fileslist: any = [];
  imagedetails: any = [];
  deletionimage: any;
  folderName: any;
  eventGroup: FormGroup;
  closeResult: string;
  imagename: any;
  progressInfos = [];
  message = '';
  fileInfos: any;
  fileGroup: FormGroup

  constructor(private eventservice: EventsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private config: NgbCarouselConfig,
    private schoolService: SchoolService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.classes = this.commonService.getCommonValue('CLASS', '');
    this.sections = this.commonService.getCommonValue('SECTION', '');
    this.getSchools();
    this.getAllFolders();
    this.eventGroup = this.fb.group({
      eventId: [null],
      eventName: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      schoolIdno: ['', [Validators.required]],
      classId: ['', [Validators.required]],
      sectionId: ['', [Validators.required]],
      createdBy: ['', Validators.required],
      createdDate: ['', Validators.required]
    });
    // this.loadAllImages();
    this.fileGroup = this.fb.group({
      file:['',  [Validators.required]]
    });
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

  
  getAllFolders() {
    this.eventservice.getAllFolders().subscribe(
      data => {
        this.folders = data;
      },
      error => {
      }
    );
  }

  saveOrUpdate() {
    console.log(this.eventGroup.value);
    if (this.isNew) {
      this.eventservice.createFolder(this.eventGroup.value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('Folder created', 'Success');
          this.getAllFolders();
          this.eventGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in creating folder', 'Error');
        }
      );
    } else {
      this.eventservice.updateFolder(this.eventGroup.value, this.eventGroup.get('eventId').value).subscribe(
        (data: any) => {
          console.log(data);
          this.modalService.dismissAll("on success");
          this.toastr.success('Folder updated', 'Success');
          this.getAllFolders();
          this.eventGroup.reset();
        },
        (error: any) => {
          console.log(error);
          this.modalService.dismissAll("on fail");
          this.toastr.error('Error in updating folder', 'Error');
        }
      );
    }
  }

  filesFromFolder(folderName: any) {
    this.spinner.show();
    this.folderName = folderName;
    this.eventservice.getAllFilesFolder(folderName).subscribe(
      data => {
        this.spinner.hide();
        this.images = data;
        for (var index in this.images) {
          this.fileDetials(this.images[index]);
          /// console.log(index);
        }
      }, error => {
        this.spinner.hide();
      }
    );
  }

  fileDetials(imagename: any) {
    let imgName = imagename.slice(imagename.lastIndexOf('-') + 1, imagename.lastIndexOf('.'));
    let imgextension = imagename.slice(imagename.lastIndexOf('.') + 1, imagename.length);
    let fullImgName = imagename.slice(imagename.lastIndexOf('/') + 1, imagename.length);
    this.idgeneration++;
    let imagedetail = {
      "imagename": imgName,
      "imageextension": imgextension,
      "fullImgName": fullImgName,
      "foldername": this.folderName,
      "id": this.idgeneration
    };
    this.imagedetails.push(imagedetail);

  }


  openDelete(deleteConfirm, image) {
    this.deletionimage = image;
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
    this.eventservice.deleteImageInFolder(this.deletionimage.foldername,
      this.deletionimage.fullImgName).subscribe(
        (data: any) => {
          this.imagedetails;
          this.modalService.dismissAll("on fail");
          this.toastr.success('Image Deleted', 'Success');
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

  open(content, type: boolean, event?) {
    this.isNew = type;
    this.manageeventHeading = this.isNew
      ? "Create FolderName"
      : "Update FolderName";
    if (this.isNew) {
      this.eventGroup.reset();
    } else {
      this.eventGroup.patchValue(event, { onlySelf: true });
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

  selectFile(event) {
    this.selectedFiles = event.target.files;
    
  }

  upload() {
    for (let j = 0; j < this.selectedFiles.length; j++) {
     this.currentFileUpload = this.selectedFiles.item(j);
       this.eventservice.pushFileToStorage(this.currentFileUpload, this.folderName).subscribe(event => {});
     };
   // this.eventservice.pushFileToStorage(this.selectedFiles, this.folderName).subscribe(event => { });
    if (event instanceof HttpResponse) {
      console.log('Files is completely uploaded!');
      this.toastr.success('files upload successfully', 'Success');
      this.selectedFiles = undefined;
    }
  }


  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);

  }

  // uploadFiles() {
  //   this.message = '';

  //   for (let i = 0; i < this.selectedFiles.length; i++) {
  //     this.upload(i, this.selectedFiles[i]);
  //   } if (event instanceof HttpResponse) {
  //     console.log('Files is completely uploaded!');
  //     this.toastr.success('files upload successfully', 'Success');
  //     this.selectedFiles = undefined;
  //   }

  // }
  // name: any;
  // upload(idx, file) {
  //   this.progressInfos[idx] = { value: 0, file };

  //   this.eventservice.pushFileToStorage(file, this.folderName).subscribe(
  //     event => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
  //       }
  //     },
  //     err => {
  //       this.progressInfos[idx].value = 0;
  //       this.message = 'Could not upload the file:' + file.name;
  //     });
  // }
}



