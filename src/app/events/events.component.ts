import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;

  

  constructor(private eventservice:EventsService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    for(let j = 0; j < this.selectedFiles.length; j++){
      this.currentFileUpload = this.selectedFiles.item(j);
      this.eventservice.pushFileToStorage(this.currentFileUpload).subscribe(event => {
         if (event instanceof HttpResponse) {
          console.log('File is completely uploaded!');
          this.toastr.success('files upload successfully', 'Success');
        }
        
      });
    };
   
    this.selectedFiles = undefined;
  }

}
