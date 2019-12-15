import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from './services/app/app.service';

import { of } from 'rxjs';
import {
  take,
  catchError,
  tap,
} from 'rxjs/operators';

import MockData from './mockData.json';
import { IDropDown } from './models/dropdown.model';
import { IFormItem } from './models/formItem.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  calcForm: FormGroup = null;
  childrenOptions: IDropDown[] = MockData.children;
  coapplicantOptions: IDropDown[] = MockData.coapplicant;
  mockData: object = MockData;

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.calcForm = this.appService
      .initForm();
  }

  onSubmit(): void {
    this.calcForm.markAllAsTouched();

    if (this.calcForm.valid) {
      const newItem: IFormItem = {
        monthlyIncome: this.calcForm
          .get('monthlyIncome')
          .value,
        requestedAmount: this.calcForm
          .get('requestedAmount')
          .value,
        loanTerm: this.calcForm
          .get('loanTerm')
          .value,
        children: this.calcForm
          .get('children')
          .value,
        coapplicant: this.calcForm
          .get('coapplicant')
          .value
      };

      this.appService
        .sendToServer(newItem)
        .pipe(
          take(1),
          tap((result) => {
            console.log('result', result);
          }),
          catchError((err) => {
            console.log('err', err);

            return of(err);
          })
        )
        .subscribe();
    }
  }
}
