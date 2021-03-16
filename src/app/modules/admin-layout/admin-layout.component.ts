import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';

import {AuthService} from '~services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  providers: [AuthService]
})

export class AdminLayoutComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  @ViewChild('progressBar', {static: false})
  progressBar: ElementRef;

  constructor(
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
    private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    router.events.subscribe((event: RouterEvent) => {
      this._navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }


  // PROGRESS BAR
  private _navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.ngZone.runOutsideAngular(() => {
        this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '1');
      });
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.hideProgressBar();
      }, 1000);
    }
    if (event instanceof NavigationCancel) {
      setTimeout(() => {
        this.hideProgressBar();
      }, 1000);
    }
    if (event instanceof NavigationError) {
      setTimeout(() => {
        this.hideProgressBar();
      }, 1000);
    }
  }

  changeTheme() {

  }

  private hideProgressBar(): void {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '0');
    });
  }

}
