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
  static BE_URL: string = 'https://homework.fdp.workers.dev/swb-222222';
  static NUMBER_REGEX: string = `[1-9][0-9]*`;

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
    const headers = new HttpHeaders({
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    return this.http.post<any>(
      AppService.BE_URL,
      { form },
      { headers }
    );
  }
}
