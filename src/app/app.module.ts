import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';


import {SharedModule} from '~utils/shared.module';

import {AppRoutingModule} from '~app/app.routes';

import {AuthGuard} from '~guards/auth.guard';

import {AppComponent} from '~components/app/app.component';
import {TablesComponent} from '~components/tables/tables.component';
import {ContactUsComponent} from '~components/contact-us/contact-us.component';
import {NotFoundComponent} from '~components/not-found/not-found.component';
import {ConfirmComponent} from '~components/confirm/confirm.component';
import {SnackbarComponent} from '~components/snackbar/snackbar.component';

import {AuthService} from '~services/auth.service';
import {UserService} from '~services/user.service';
import {ProductService} from '~app/services/product.service';


import {UserModule} from '~modules/user/user.module';
import {AdminLayoutModule} from '~modules/admin-layout/admin-layout.module';
import {LoginLayoutModule} from '~modules/login-layout/login-layout.module';
import {httpInterceptorProviders} from '~utils/interceptors';
import {ImageService} from '~services/image.service';

@NgModule({
  declarations: [
    AppComponent,
    TablesComponent,
    ContactUsComponent,
    NotFoundComponent,
    ConfirmComponent,
    SnackbarComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AdminLayoutModule,
    LoginLayoutModule,
    UserModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    UserService,
    ProductService,
    ImageService,
    httpInterceptorProviders,
  ],
  entryComponents: [
    ConfirmComponent,
    SnackbarComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
