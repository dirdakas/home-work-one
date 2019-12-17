import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { Observable } from 'rxjs';

import MockData from '../../mockData.json';
import { IFormItem } from '../../models/formItem.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  static BE_URL: string = 'https://homework.fdp.workers.dev/';
  static NUMBER_REGEX: string = '^[1-9]+\d*';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) { }

  initForm(): FormGroup {
    return this.fb.group({
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
    });
  }

  sendToServer(form: IFormItem): Observable<any> {
    return this.http.post<any>(
      AppService.BE_URL,
      { form }
    );
  }
}
