import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  usedLanguage: any = 'en';

  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  getAllHolidays() {
    return this.http.get(this.url + 'Holidays');
  }

  createHoliday(holiday: any) {
    return this.http.post(this.url + 'Holidays', holiday);
  }

  updateHoliday(holiday: any, id: any) {
    return this.http.put(this.url + 'Holidays/' + id, holiday);
  }

  deleteHoliday(id: any) {
    return this.http.delete(this.url + 'Holidays/' + id);
  }
}
