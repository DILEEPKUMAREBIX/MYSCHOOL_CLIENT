import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  usedLanguage: any = 'en';
  
  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  getAllHomeWorks() {
    // var reqHeader = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'bearer ' + JSON.parse(window.sessionStorage.getItem('token')).access_token
    // });
    // return this.http.get(this.url + 'Users', {headers: reqHeader});
    return this.http.get(this.url + 'homework');
  }

  createHomeWork(homework: any) {
    return this.http.post(this.url + 'homework', homework);
  }

  updateHomeWork(homework: any, id: any) {
    return this.http.put(this.url + 'homework/' + id, homework);
  }

  
  deleteHomeWork(id: any) {
    return this.http.delete(this.url + 'homework/' + id);
  }
 }
