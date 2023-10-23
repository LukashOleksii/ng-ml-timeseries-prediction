import { Component, OnInit } from '@angular/core';
import { MlPredictionApiService } from 'src/services/ml-prediction-api';
import { MlPredictionInput } from '../ml-predictions-form/ml-predictions-form.model';

@Component({
  selector: 'app-list-models',
  templateUrl: './list-models.component.html',
  styleUrls: ['./list-models.component.scss']
})
export class ListModelsComponent implements OnInit {

  modelsInput: MlPredictionInput[] = [];

  error: boolean = false;

  constructor(private mlPredictionApi: MlPredictionApiService) { }

  ngOnInit(): void {
    this.mlPredictionApi.getAvailbleModelPredictions().subscribe({
      next: (result) => {
        this.modelsInput.push(...result);

        console.log(this.modelsInput);
      },
      error: (error) => this.error = true
    });
  }

}
