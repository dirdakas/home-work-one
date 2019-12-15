import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { AppService } from './services/app/app.service';
import MockData from './mockData.json';
import { IFormItem } from './models/formItem.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let appService: jasmine.SpyObj<AppService>;
  let MOCK_FORM_GROUP: FormGroup;
  const MOCK_STRING: string = 'this is a string';
  const MOCK_VALID_DATA: IFormItem = {
    children: 'NONE',
    coapplicant: 'NONE',
    loanTerm: 300,
    monthlyIncome: 666555444,
    requestedAmount: 20000000
  };

  beforeEach(async(() => {
    MOCK_FORM_GROUP = getForm();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        CommonModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
      ],
      providers: [
        {
          provide: AppService,
          useValue: jasmine.createSpyObj('AppService', [
            'initForm',
            'sendToServer'
          ]),
        },
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    appService = TestBed.get(AppService);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    appService.initForm
      .and
      .returnValue(MOCK_FORM_GROUP);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('should onSubmit', () => {
    it('should be invalid -> empty form', () => {
      component.onSubmit();

      expect(component.calcForm.controls.monthlyIncome.errors.required)
        .toBeTruthy();
      expect(component.calcForm.controls.requestedAmount.errors.required)
        .toBeTruthy();
      expect(component.calcForm.controls.loanTerm.errors.required)
        .toBeTruthy();
      expect(component.calcForm.controls.children.errors.required)
        .toBeTruthy();
      expect(component.calcForm.controls.coapplicant.errors.required)
        .toBeTruthy();
    });

    it('should be invalid -> not numbers provided', () => {
      component.calcForm.controls.monthlyIncome
        .setValue(MOCK_STRING);
      component.calcForm.controls.requestedAmount
        .setValue(MOCK_STRING);
      component.calcForm.controls.loanTerm
        .setValue(MOCK_STRING);

      component.onSubmit();

      expect(component.calcForm.controls.monthlyIncome.errors.pattern)
        .toBeTruthy();
      expect(component.calcForm.controls.requestedAmount.errors.pattern)
        .toBeTruthy();
      expect(component.calcForm.controls.loanTerm.errors.pattern)
        .toBeTruthy();
    });

    it('should be invalid -> min problem', () => {
      component.calcForm.controls.monthlyIncome
        .setValue(0);
      component.calcForm.controls.requestedAmount
        .setValue(0);
      component.calcForm.controls.loanTerm
        .setValue(0);

      component.onSubmit();

      expect(component.calcForm.controls.monthlyIncome.errors.min)
        .toBeTruthy();
      expect(component.calcForm.controls.requestedAmount.errors.min)
        .toBeTruthy();
      expect(component.calcForm.controls.loanTerm.errors.min)
        .toBeTruthy();
    });

    it('should be invalid -> max problem', () => {
      component.calcForm.controls.loanTerm
        .setValue(999);

      component.onSubmit();

      expect(component.calcForm.controls.loanTerm.errors.max)
        .toBeTruthy();
    });

    it('should be valid, call BE', () => {
      component.calcForm.controls.monthlyIncome
        .setValue(MOCK_VALID_DATA.monthlyIncome);
      component.calcForm.controls.requestedAmount
        .setValue(MOCK_VALID_DATA.requestedAmount);
      component.calcForm.controls.loanTerm
        .setValue(MOCK_VALID_DATA.loanTerm);
      component.calcForm.controls.children
        .setValue(MOCK_VALID_DATA.children);
      component.calcForm.controls.coapplicant
        .setValue(MOCK_VALID_DATA.coapplicant);

      appService.sendToServer
        .and
        .returnValue(of(200));

      component.onSubmit();

      expect(appService.sendToServer)
        .toHaveBeenCalled();
    });

    // more tests for success/fail BE response
  });

  function getForm(): FormGroup {
    return new FormGroup(
      {
        monthlyIncome: new FormControl(
          '',
          [
            Validators.required,
            Validators.min(MockData['min-monthly-income']),
            Validators.pattern(AppService.NUMBER_REGEX)
          ]
        ),
        requestedAmount: new FormControl(
          '',
          [
            Validators.required,
            Validators.min(MockData['min-request-amount']),
            Validators.pattern(AppService.NUMBER_REGEX)
          ]
        ),
        loanTerm: new FormControl(
          '',
          [
            Validators.required,
            Validators.min(MockData['min-load-term']),
            Validators.max(MockData['max-load-term']),
            Validators.pattern(AppService.NUMBER_REGEX)
          ]
        ),
        children: new FormControl(
          '',
          Validators.required
        ),
        coapplicant: new FormControl(
          '',
          Validators.required
        )
      }
    );
  }
});
