import { Component, OnInit } from '@angular/core';
import { InputField, MlPredictionInput } from './ml-predictions-form.model';
import { Router } from '@angular/router'
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-ml-predictions-form',
  templateUrl: './ml-predictions-form.component.html',
  styleUrls: ['./ml-predictions-form.component.scss']
})
export class MlPredictionsFormComponent {

  fieldsInput: MlPredictionInput | undefined = undefined;

  form: FormGroup = new FormGroup({});
  model: any = {};

  error: boolean = false;
  constructor(private router: Router) {
    this.fieldsInput = this.router.getCurrentNavigation()?.extras?.state as MlPredictionInput
    if (this.fieldsInput == undefined) {
      this.error = true;
      this.router.navigate(['']);
    }
    else {
      this.fieldsInput.fields.forEach(field => this.form.addControl(field.name, new FormControl(field.name, this.buildValidators(field))));
      console.log(this.form.controls);
    }
  }

  private buildValidators(field: InputField): ValidatorFn[] {
    const validators = [];
    if (field.mandatory) {
      validators.push(Validators.required);
    }
    if (field.numberConstrain?.minValue) {
      validators.push(Validators.min(field.numberConstrain?.minValue));
    }
    if (field.numberConstrain?.maxValue) {
      validators.push(Validators.max(field.numberConstrain?.maxValue));
    }
    console.log(validators, field.name);
    return validators;
  }

  submit(): void {
    console.log(this.model);
    console.log(this.form.valid);
  }
}
