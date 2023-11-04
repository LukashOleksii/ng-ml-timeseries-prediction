import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ResultComponent } from './result/result.component';
import { GeneralFormComponent } from './general-form/general-form.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
    declarations: [HomeComponent, ResultComponent, GeneralFormComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NzLayoutModule,
        NzIconModule,
        NzBreadCrumbModule,
        NzButtonModule,
        NzMenuModule,
        NzGridModule,
        NzToolTipModule,
        NzProgressModule,
        NzFormModule,
        NzDropDownModule,
        NzSelectModule,
    ]
})
export class HomeModule { }
