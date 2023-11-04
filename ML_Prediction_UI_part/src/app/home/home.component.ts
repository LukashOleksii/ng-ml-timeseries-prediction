import { Component, OnInit } from '@angular/core';
import { MlPredictionApiService } from 'src/services/ml-prediction-api';
import { MlPredictionInput } from '../ml-predictions-form/ml-predictions-form.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public mlPredictionInput: MlPredictionInput[] = [];

    constructor(private mlPredictionApiService: MlPredictionApiService) { }

    ngOnInit(): void {
        this.mlPredictionApiService.getAvailbleModelPredictions().subscribe(data => {
            this.mlPredictionInput = data;

        })
    }
}
