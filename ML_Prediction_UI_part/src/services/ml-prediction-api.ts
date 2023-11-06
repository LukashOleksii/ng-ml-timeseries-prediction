import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
// import { inputMock } from "src/app/ml-predictions-form/ml-predictions-form.mock";
import { MlPredictionBody, MlPredictionInput, MlPredictionResponse } from "src/app/ml-predictions-form/ml-predictions-form.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MlPredictionApiService {

    private url: string;

    constructor(private http: HttpClient) {
        this.url = environment.mlPredictionApiUrl;
    }

    getAvailbleModelPredictions(): Observable<MlPredictionInput[]> {
        return this.http.get<MlPredictionInput[]>(`${this.url}/models`, {headers : new HttpHeaders({ 'Content-Type': 'application/json', 'timeout': '5000' })});
    }

    postPrediction(body: MlPredictionBody): Observable<MlPredictionResponse> {
        // body.fields = this.removeEmpty(body.fields);
        console.log(body);
        return this.http.post<MlPredictionResponse>(`${this.url}/prediction`, body, {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
    }

    // private removeEmpty(obj: any): any{
    //     Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    //     return obj;
    //   };
}