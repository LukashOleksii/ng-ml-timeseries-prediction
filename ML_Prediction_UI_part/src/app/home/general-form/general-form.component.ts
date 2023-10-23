import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputField, MlPredictionInput } from 'src/app/ml-predictions-form/ml-predictions-form.model';
import { MlPredictionApiService } from 'src/services/ml-prediction-api';
import { MlPredictionResultService } from 'src/services/ml-prediction-result-save';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit {

  validateForm: FormGroup;

  isLoaded: boolean = false;

  isError: boolean = false;

  public mlPredictionInput: MlPredictionInput | undefined;

  public vehicleType: string | null = null;

  public models: string[] = [];

  constructor(private mlPredictionApiService: MlPredictionApiService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private mlPredictionResultSaver: MlPredictionResultService) {
    this.vehicleType = route.snapshot.paramMap.get('vehicleType');
    this.validateForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.mlPredictionApiService.getAvailbleModelPredictions().subscribe(data => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.mlPredictionInput = data.find(mlPredictionInput => mlPredictionInput.vehicleType === this.vehicleType);
      console.log(this.mlPredictionInput);
      this.mlPredictionInput?.fields.forEach(field => {
        this.validateForm.addControl(field.name, new FormControl(null, this.buildValidators(field)));
        if (field.isModel) {
          this.validateForm.addControl('model version', new FormControl(null, [Validators.required]));
        }
      })
    }, error => {this.isError = true; this.isLoaded = true;}, () => this.isLoaded = true);
  }

  private buildValidators(field: InputField): ValidatorFn[] {
    const validators = [];
    if (field.mandatory) {
      validators.push(Validators.required);
    }
    if (field.numberConstrain?.minValue !== undefined) {
      validators.push(Validators.min(field.numberConstrain?.minValue));
    }
    if (field.numberConstrain?.maxValue !== undefined) {
      validators.push(Validators.max(field.numberConstrain?.maxValue));
    }

    return validators;
  }

  public setManufacturer(modelValue:any):void{
    this.validateForm.controls['model version'].reset();
    this.models = this.mlPredictionInput?.fields.find(field => field.isModel == true)?.categoricalConstrain?.values.find(value => value.mark == modelValue )?.model;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.mlPredictionApiService.postPrediction({ vehicleType: this.vehicleType!, fields: this.validateForm.value }).subscribe(result => {
        this.mlPredictionResultSaver.saveLastResult(result);
        this.router.navigateByUrl('/result');
      })

    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
