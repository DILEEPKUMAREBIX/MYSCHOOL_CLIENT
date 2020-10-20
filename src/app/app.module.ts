import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AppComponent } from './app.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedpluginModule } from './shared/fixedplugin/fixedplugin.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AppRoutes } from './app.routing';
import { MaterialModule } from './mat.module';
import { SchoolComponent } from './schools/school.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { UsersComponent } from './users/user.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { EventsComponent } from './events/events.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeworkComponent } from './homework/homework.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { LeavesComponent } from './leaves/leaves.component';
import { ClassperiodComponent } from './classperiod/classperiod.component';
import { TimetableComponent } from './timetable/timetable.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TimetablefilterPipe } from './shared/pipes/timetablefilter.pipe';



@NgModule({
  exports: [
    TranslateModule
  ],
  imports: [
    CommonModule,
    AngularEditorModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    HttpModule,
    MaterialModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    SchoolComponent,
    UsersComponent,
    EventsComponent,
    HomeworkComponent,
    HolidaysComponent,
    LeavesComponent,
    ClassperiodComponent,
    TimetableComponent,
    TimetablefilterPipe

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}