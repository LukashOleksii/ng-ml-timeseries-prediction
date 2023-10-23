import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlPredictionsFormComponent } from './ml-predictions-form.component';

describe('MlPredictionsFormComponent', () => {
  let component: MlPredictionsFormComponent;
  let fixture: ComponentFixture<MlPredictionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlPredictionsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MlPredictionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
