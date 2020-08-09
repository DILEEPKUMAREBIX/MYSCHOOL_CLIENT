import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SchoolComponent } from './schools/school.component';
// import { UserComponent } from './userpage/user.component';
import { UsersComponent } from './users/user.component';
import { EventsComponent } from './events/events.component';
import { HomeworkComponent } from './homework/homework.component';
import { LeavesComponent } from './leaves/leaves.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { ClassperiodComponent } from './classperiod/classperiod.component';

export const AppRoutes: Routes = [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }, {
      path: '',
      component: AdminLayoutComponent,
      children: [
          {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    }, {
        path: 'schools',
        component: SchoolComponent
    }, {
        path: 'users',
        component: UsersComponent
    },{
        path: 'events',
        component: EventsComponent
    },{
        path: 'homework',
        component: HomeworkComponent
    },{
        path: 'leaves',
        component: LeavesComponent
    },{
        path: 'holidays',
        component: HolidaysComponent
    },{
        path: 'classperiod',
        component: ClassperiodComponent
    },{
        path: 'tables',
        loadChildren: './tables/tables.module#TablesModule'
    }, {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule'
    }, {
        path: 'charts',
        loadChildren: './charts/charts.module#ChartsModule'
    }, {
        path: 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
    }, {
        path: '',
        loadChildren: './userpage/user.module#UserModule'
    }, {
        path: '',
        loadChildren: './timeline/timeline.module#TimelineModule'
    }
  ]}, {
      path: '',
      component: AuthLayoutComponent,
      children: [{
        path: 'pages',
        loadChildren: './pages/pages.module#PagesModule'
      }]
    }
];
