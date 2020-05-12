import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

}
