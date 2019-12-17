import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class BaseInterceptorService implements HttpInterceptor {
  static CONTENT_TYPE: string = 'application/json; charset=utf-8';

  constructor() { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      Accept: BaseInterceptorService.CONTENT_TYPE,
      'Content-Type': BaseInterceptorService.CONTENT_TYPE,
      'Access-Control-Allow-Origin': '*',
      'X-API-KEY': 'swb-222222',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    });
    const duplicate: HttpRequest<any> = req.clone({
      headers,
      url: req.url,
      withCredentials: true
    });

    return next.handle(duplicate);
  }
}
