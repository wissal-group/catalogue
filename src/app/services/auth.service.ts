import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    public http: HttpClient,
    private router: Router,
  ) {
  }

  headers = new HttpHeaders({
    'x-access-token': localStorage.getItem('token')
  });

  isExpired(): boolean {
    const connectionTime = localStorage.getItem('connection_time');
    const tokenLife = localStorage.getItem('expires_in');
    return (Number(connectionTime) + Number(tokenLife) * 1000) - Number(Date.now().toString()) < 0;
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

}
