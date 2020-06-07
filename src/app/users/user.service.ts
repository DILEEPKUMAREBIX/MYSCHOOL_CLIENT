import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  usedLanguage: any = 'en';
  
  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  getAllUsers() {
    // var reqHeader = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'bearer ' + JSON.parse(window.sessionStorage.getItem('token')).access_token
    // });
    // return this.http.get(this.url + 'Users', {headers: reqHeader});
    return this.http.get(this.url + 'users');
  }

  createUser(school: any) {
    return this.http.post(this.url + 'users', school);
  }

  deleteUser(id: any) {
    return this.http.delete(this.url + 'users/' + id);
  }
  pushFileToStorage(file: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST',this.url+'users/usersupload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
}
