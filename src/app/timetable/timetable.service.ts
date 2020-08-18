import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  usedLanguage: any = 'en';

  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  getAllTimetables() {
    return this.http.get(this.url + 'timetables');
  }

  
  createTimetable(Timetable: any) {
    return this.http.post(this.url + 'timetables', Timetable);
  }

  updateTimetable(Timetable: any,id:any) {
    return this.http.put(this.url + 'timetables/'+ id, Timetable);
  }

  deleteTimetable(id: any) {
    return this.http.delete(this.url + 'timetables/' + id);
  }
}
