import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

import {AuthService} from '~services/auth.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: []
})

export class LoginComponent implements OnInit {
  public form: FormGroup;
  public isLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public snack: MatSnackBar,
  ) {
  }

  ngOnInit() {

    const url = this.router.url.split('&');

    // getAuthenticationToken
    const temp = url[1];
    if (temp) {
      const token = temp.split('=')[1];
      const id_token = url[0].split('=')[1];
      const expires_in = url[2].split('=')[1];

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('id_token', id_token);
        localStorage.setItem('expires_in', expires_in);
        localStorage.setItem('connection_time', Date.now().toString());

        this.authService.loggedIn.next(true);
      }
    }

    if (localStorage.getItem('token')) {
      this.authService.loggedIn.next(true);
      this.router.navigate(['/']);
    }
  }


  public login() {
    window.location.href = environment.loginUrl;
  }

}
