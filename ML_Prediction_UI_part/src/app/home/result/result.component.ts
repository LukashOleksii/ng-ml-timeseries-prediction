import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MlPredictionResult, MlPredictionResultService } from 'src/services/ml-prediction-result-save';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
    
    public result: MlPredictionResult
    
    constructor(private mlPredictionResultService: MlPredictionResultService) {}

    ngOnInit(): void {
        this.result = this.mlPredictionResultService.getLastResult();
    }

    ngOnDestroy(): void {
        this.mlPredictionResultService.saveLastResult(undefined);
    }
}
