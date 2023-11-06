import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralFormComponent } from './general-form/general-form.component';

import { HomeComponent } from './home.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'Heavy Machinery'
    },
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'result',
                component: ResultComponent
            },
            {
                path: ':vehicleType',
                component: GeneralFormComponent
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'Heavy Machinery'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
