import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MlPredictionResult, MlPredictionResultService } from 'src/services/ml-prediction-result-save';
import { HttpClient } from '@angular/common/http';

interface AccuracyDeviation {
    SENSOR_NAME: string;
    MAE: string;
    MSE: string;
    RMSE: string;
}

interface StatusOnPercentage {
    SENSOR_NAME: string;
    NORMAL: string;
    WARNING: string;
    CRITICAL: string;
}

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit, OnDestroy {

    public result: MlPredictionResult
    public sensorData: any[] = [];
    public description:  any;
    public statusOnPercentageCNN: any[] = [];
    public statusOnPercentageLSTM: any[] = [];
    public combinedSensorNames: any[] = [];

    constructor(private mlPredictionResultService: MlPredictionResultService, private http: HttpClient) {}

    ngOnInit(): void {
        this.result = this.mlPredictionResultService.getLastResult();

        const accuracyDeviationCNN: AccuracyDeviation[] = this.result?.accuracyDeviationCNN;
        const accuracyDeviationLSTM: AccuracyDeviation[] = this.result?.accuracyDeviationLSTM;

        if (accuracyDeviationCNN && accuracyDeviationLSTM) {
            this.sensorData = accuracyDeviationCNN.map(cnn => {
                const matchingLSTM = accuracyDeviationLSTM.find(lstm => lstm.SENSOR_NAME === cnn.SENSOR_NAME);
                return {
                    SENSOR_NAME: cnn.SENSOR_NAME,
                    MAE_CNN: cnn.MAE,
                    MSE_CNN: cnn.MSE,
                    RMSE_CNN: cnn.RMSE,
                    MAE_LSTM: matchingLSTM ? matchingLSTM.MAE : "N/A",
                    MSE_LSTM: matchingLSTM ? matchingLSTM.MSE : "N/A",
                    RMSE_LSTM: matchingLSTM ? matchingLSTM.RMSE : "N/A",
                };
            });
        }

        this.http.get('/assets/description.json').subscribe((data) => {
            this.description = data;
          });

        // Assuming data is already loaded and stored in statusOnPercentageCNN and statusOnPercentageLSTM
        const statusOnPercentageCNN: StatusOnPercentage[] = this.result?.statusOnPercentageCNN;
        const statusOnPercentageLSTM: StatusOnPercentage[] = this.result?.statusOnPercentageLSTM;

        const sensorsWithHighWarningsCNN = this.searchSensorsWithHighWarnings(statusOnPercentageCNN);
        const sensorsWithHighWarningsLSTM = this.searchSensorsWithHighWarnings(statusOnPercentageLSTM);

        console.log('Sensors with high warnings (CNN):', sensorsWithHighWarningsCNN);
        console.log('Sensors with high warnings (LSTM):', sensorsWithHighWarningsLSTM);

        this.combinedSensorNames = [...new Set([...sensorsWithHighWarningsCNN, ...sensorsWithHighWarningsLSTM])];

        console.log('Combined Sensors with High Warnings:', this.combinedSensorNames);
    }

    ngOnDestroy(): void {
        this.mlPredictionResultService.saveLastResult(undefined);
    }

    searchSensorsWithHighWarnings(data: any[]): string[] {
        const result: string[] = [];
        if (data?.length){
            for (const item of data) {
                const totalWarningsAndCritical =
                    parseFloat(item['WARNING'].replace('%', '')) +
                    parseFloat(item['CRITICAL'].replace('%', ''));

                if (totalWarningsAndCritical > 10) {
                    result.push(item['SENSOR_NAME']);
                }
                }
        }


        return result;
    }
}
