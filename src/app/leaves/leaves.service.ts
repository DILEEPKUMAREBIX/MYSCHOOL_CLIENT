import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  usedLanguage: any = 'en';

  
  url: string = environment.APIURL + 'myschool/';
  constructor(private http: HttpClient) { }

  getAllLeaves() {
    return this.http.get(this.url + 'Leaves');
  }

  createLeave(leave: any) {
    return this.http.post(this.url + 'Leaves', leave);
  }

  updateLeave(leave: any,id:any) {
    return this.http.put(this.url + 'Leaves/'+ id, leave);
  }

  deleteLeave(id: any) {
    return this.http.delete(this.url + 'Leaves/' + id);
  }
}
