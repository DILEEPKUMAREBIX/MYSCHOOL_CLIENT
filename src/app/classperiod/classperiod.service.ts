import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClassperiodService {

  usedLanguage: any = 'en';

  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  getAllClassperiods() {
    return this.http.get(this.url + 'classperiod');
  }

  
  createClassperiod(Classperiod: any) {
    return this.http.post(this.url + 'classperiod', Classperiod);
  }

  updateClassperiod(Classperiod: any,id:any) {
    return this.http.put(this.url + 'classperiod/'+ id, Classperiod);
  }

  deleteClassperiod(id: any) {
    return this.http.delete(this.url + 'classperiod/' + id);
  }
}
