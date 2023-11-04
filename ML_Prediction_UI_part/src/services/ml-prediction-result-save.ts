import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
// import { inputMock } from "src/app/ml-predictions-form/ml-predictions-form.mock";
import { MlPredictionBody, MlPredictionInput, MlPredictionResponse } from "src/app/ml-predictions-form/ml-predictions-form.model";
import { environment } from "src/environments/environment";

export type MlPredictionResult = MlPredictionResponse | undefined;

@Injectable({
    providedIn: 'root'
})
export class MlPredictionResultService {

    private lastResult: MlPredictionResult;

    saveLastResult(mlPredictionResult: MlPredictionResult): void {
        this.lastResult = mlPredictionResult
    }

    getLastResult(): MlPredictionResult {
        return this.lastResult;
    }
}