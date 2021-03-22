import {Component} from '@angular/core';
import {ConfirmComponent} from '~components/confirm/confirm.component';
import {AuthService} from '~services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';


  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
  ) {


  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        title: 'Logout',
        message: 'Close session?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.authService.loggedIn.next(false);
      }
    });
  }
}

