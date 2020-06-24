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
    return this.http.get(this.url + 'schools');
  }

  createSchool(school: any) {
    return this.http.post(this.url + 'schools', school);
  }

  updateSchool(school: any,id:any) {
    return this.http.put(this.url + 'schools/'+ id, school);
  }

  deleteSchool(id: any) {
    return this.http.delete(this.url + 'schools/' + id);
  }

}
