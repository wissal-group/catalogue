import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AuthService} from '~services/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class Interceptor implements HttpInterceptor {

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8',
    // 'Access-Control-Allow-Methods': ': GET, POST, OPTIONS, PUT, DELETE',
    // 'Access-Control-Allow-Credentials': 'true',
  });

  constructor(private authService: AuthService) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqWithHeaders = req.clone({
      headers: this.headers
    });
    return next.handle(reqWithHeaders).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => {
          this.authService.isExpired();
        },
        // Operation failed; error is an HttpErrorResponse
        error => {
          if (error.error.message === 'Unauthorized' && this.authService.isExpired()) {
            this.authService.logout();
            console.log('logout ' + this.authService.isExpired());
          }
        }
      )
    );
  }
}
