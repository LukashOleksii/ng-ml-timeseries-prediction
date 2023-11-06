import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MachineryField, WorkTypeField, MlPredictionInput } from 'src/app/ml-predictions-form/ml-predictions-form.model';
import { MlPredictionApiService } from 'src/services/ml-prediction-api';
import { MlPredictionResultService } from 'src/services/ml-prediction-result-save';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit {
  isLoaded: boolean = false;

  isError: boolean = false;

  public mlPredictionInput: MlPredictionInput | undefined;
  public machineryField: any;
  public workTypeField: any;

  public selectedVehicle: any;
  public selectedWork: any;
  public vehicleType: string | null = null;

  constructor(private mlPredictionApiService: MlPredictionApiService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private mlPredictionResultSaver: MlPredictionResultService) {
    this.vehicleType = route.snapshot.paramMap.get('vehicleType');
  }

  ngOnInit(): void {
    this.mlPredictionApiService.getAvailbleModelPredictions().subscribe(data => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.mlPredictionInput = data.find(mlPredictionInput => mlPredictionInput.vehicleType === this.vehicleType);

      console.log(this.mlPredictionInput);

      this.machineryField = this.mlPredictionInput?.machinery
      this.workTypeField = this.mlPredictionInput?.workType

      console.log(this.machineryField);

    }, error => {this.isError = true; this.isLoaded = true;}, () => this.isLoaded = true);
  }

  // submitForm(): void {
  //   console.log('submit');
  //   this.mlPredictionApiService.postPrediction({ vehicleType: this.vehicleType!, fields: 'this.validateForm.value' }).subscribe(result => {
  //     this.mlPredictionResultSaver.saveLastResult(result);
  //     this.router.navigateByUrl('/result');
  //   })
  // }

  submit(): void {
    console.log('submit');
    this.mlPredictionApiService.postPrediction({title: this.selectedVehicle.title, vehicleType: this.selectedVehicle.identifier, workType: this.selectedWork.difficultCoef}).subscribe(result => {
      this.mlPredictionResultSaver.saveLastResult(result);
      this.router.navigateByUrl('/result');
    })
  }
}
