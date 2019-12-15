import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

import { take } from 'rxjs/operators';

import { AppService } from './app.service';
import { IFormItem } from '../../models/formItem.model';

describe('AppService', () => {
  let appService: AppService;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let fb: FormBuilder = new FormBuilder();

  const MOCK_UPDATE_ITEM: IFormItem = {
    children: 'one',
    coapplicant: 'two',
    loanTerm: 333,
    monthlyIncome: 111111,
    requestedAmount: 222222
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: fb }
      ]
    });

    appService = TestBed.get(AppService);
    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
    fb = TestBed.get(FormBuilder);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(appService)
      .toBeTruthy();
  });

  it('should sendToServer', () => {
    spyOn(http, 'post')
      .and
      .callThrough();

    const newModel: IFormItem = Object.assign(
      {},
      MOCK_UPDATE_ITEM
    );

    appService.sendToServer(newModel)
      .pipe(
        take(1),
      )
      .subscribe();

    const request = httpMock.expectOne(req => {
      return (
        req.url ===
          `${ AppService.BE_URL }` &&
        req.method === 'POST'
      );
    });

    request.flush(null);
    expect(request.request.method)
      .toBe('POST');
    expect(request.request.body.form)
      .toEqual(MOCK_UPDATE_ITEM);
    expect(request.request.headers.get('Accept'))
      .toEqual('application/json; charset=utf-8');
  });

  it('should return initForm', () => {
    const result: FormGroup = appService
      .initForm();

    expect(result.controls.monthlyIncome)
      .toBeTruthy();
    expect(result.controls.requestedAmount)
      .toBeTruthy();
    expect(result.controls.loanTerm)
      .toBeTruthy();
    expect(result.controls.children)
      .toBeTruthy();
    expect(result.controls.coapplicant)
      .toBeTruthy();
  });
});
