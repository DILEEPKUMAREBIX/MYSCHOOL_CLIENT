import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  
  usedLanguage: any = 'en';
  
  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  getAllSchools() {
    // var reqHeader = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'bearer ' + JSON.parse(window.sessionStorage.getItem('token')).access_token
    // });
    // return this.http.get(this.url + 'Schools', {headers: reqHeader});
    return this.http.get(this.url + 'schools');
  }

}
