import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeUrl  } from '@angular/platform-browser';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  providers: [NgbCarouselConfig]
})
export class EventsComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;
  currentfile:File;
  showNavigationArrows = true;
  showNavigationIndicators = true;

  images: any = [];

  constructor(private eventservice: EventsService,
    private toastr: ToastrService,
    private config: NgbCarouselConfig,
    private sanitizer: DomSanitizer) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.loadAllImages();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    for (let j = 0; j < this.selectedFiles.length; j++) {
      this.currentFileUpload = this.selectedFiles.item(j);
      this.eventservice.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      });
    };
    if (event instanceof HttpResponse) {
      console.log('File is completely uploaded!');
      this.toastr.success('files upload successfully', 'Success');
      this.selectedFiles = undefined;
    }
  }

  loadAllImages() {
    this.eventservice.getAllFiles().subscribe(
      data => {
        this.images = data;
      },
      error => { }
    );
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    
}
}



