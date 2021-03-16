import {Component} from '@angular/core';
import {ConfirmComponent} from '~components/confirm/confirm.component';
import {AuthService} from '~services/auth.service';
import {MatDialog} from '@angular/material/dialog';

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
        this.authService.logout().subscribe((data: any) => {
          if (data.success) {
            this.authService.loggedIn.next(false);
            localStorage.removeItem('token');
            // this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}

