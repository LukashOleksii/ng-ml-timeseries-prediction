import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-telehandler-form',
    templateUrl: './telehandler-form.component.html',
    styleUrls: ['./telehandler-form.component.scss']
})
export class TelehandlerFormComponent implements OnInit {
    validateForm!: FormGroup;

    constructor(private fb: FormBuilder, private router: Router) {}

    submitForm(): void {
        if (this.validateForm.valid) {
            console.log('submit', this.validateForm.value);
            this.router.navigateByUrl('/result');
        } else {
            Object.values(this.validateForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            fieldOne: [null, [Validators.required]],
            fieldTwo: [null, [Validators.required]],
            fieldThree: [null, [Validators.required]],
            filedFive: [null, [Validators.required]],
            fieldSix: [null, [Validators.required]]
        });
    }
}
