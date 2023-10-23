import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralFormComponent } from './general-form/general-form.component';

import { HomeComponent } from './home.component';
import { MiniExcavatorFormComponent } from './mini-excavator-form/mini-excavator-form.component';
import { ResultComponent } from './result/result.component';
import { TelehandlerFormComponent } from './telehandler-form/telehandler-form.component';
import { TractorFormComponent } from './tractor-form/tractor-form.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'forms/tractor-form'
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
                path: 'forms/:vehicleType',
                component: GeneralFormComponent
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'fruits'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
