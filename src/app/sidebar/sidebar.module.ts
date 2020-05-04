import { NgModule } from '@angular/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

@NgModule({
    imports: [RouterModule, CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })],
    declarations: [SidebarComponent],
    exports: [SidebarComponent]
})

export class SidebarModule { }

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
