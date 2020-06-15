import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    usedLanguage: any = 'en';

    url: string = environment.APIURL + 'myschool/';
    commonValues: any = [];
    constructor(private http: HttpClient) { }

   
    getCommonValue(group: string, value: string) {
        if (this.commonValues.length == 0) {
            this.commonValues = JSON.parse(window.sessionStorage.getItem('commonValues'));
        }
        if (group.length > 0 && value.length > 0) {
            return this.commonValues.filter((value: any) => value['cmGroupName'] == group && value['name'] == value);
        } else if (group.length > 0 && value.length == 0) {
            return this.commonValues.filter((value: any) => value['cmGroupName'] == group);
        } else if (group.length == 0 && value.length > 0) {
            return this.commonValues.filter((value: any) => value['name'] == value);
        }
    }

    getSchoolsCount() {
        return this.http.get(this.url + 'schoolscount');
    }

    getUsersCount() {
        return this.http.get(this.url + 'userscount');
    }

    getCommonData() {
        return this.http.get(this.url + 'commonvalues');
    }

    getSchoolsList() {
        return this.http.get(this.url + 'schoolnames');
    }
}
