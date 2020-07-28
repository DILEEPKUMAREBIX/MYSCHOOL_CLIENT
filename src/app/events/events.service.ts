import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  
  getFiles(): any {
    throw new Error("Method not implemented.");
  }
  usedLanguage: any = 'en';

  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  pushFileToStorage(file: File,folderName:any) {
    const formdata: FormData = new FormData();
      formdata.append("file",file);
    formdata.append('foldername', folderName);
    const req = new HttpRequest('POST', this.url + 'uploadFile', formdata, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  // getAllFiles() {
  //   return this.http.get(this.url + 'allfiles');
  // }

  getAllFolders() {
    return this.http.get(this.url + 'allfolders');
  }

  createFolder(event: any) {
    return this.http.post(this.url + 'createfolder', event);
  }

  updateFolder(event:any,id:any){
    return this.http.post(this.url + 'updatefolder/'+id, event);
  }
  
  getAllFilesFolder(foldername:any) {
    return this.http.get(this.url + 'allfiles/'+foldername);
  }

  deleteImageInFolder(foldername:any,fullImgName:any){
    return this.http.delete(this.url + 'deletefileinfolder/'+foldername+'/'+fullImgName);
  }
}
