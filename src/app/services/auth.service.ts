import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    public http: HttpClient
  ) {
  }

  headers = new HttpHeaders({
    'x-access-token': localStorage.getItem('token')
  });


  logout() {
    localStorage.removeItem('token');
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

}
