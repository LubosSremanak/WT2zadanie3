import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AppRoutes} from './app.routing';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFabMenuModule} from '@angular-material-extensions/fab-menu';
import {LottieModule} from 'ngx-lottie';
import {AuthenticationComponent} from './authentification/authentication.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {QRCodeModule} from 'angularx-qrcode';
import {RegisterComponent} from './authentification/register/register.component';
import {LoginComponent} from './authentification/login/login.component';
import {LoginFormComponent} from './authentification/login/login-form/login-form.component';
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {LottieComponent} from './shared/lottie-animations/lottie/lottie.component';
import {FooterComponent} from './footer/footer.component';

export function playerFactory(): any {
  return import('lottie-web/build/player/lottie_light');
}

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    RegisterComponent,
    LoginComponent,
    LoginFormComponent,
    UserDetailComponent,
    LottieComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    RouterModule.forRoot(AppRoutes, {
      scrollPositionRestoration: 'enabled'
    }),
    MatSortModule,
    MatTabsModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatCardModule,
    MatFabMenuModule,
    ReactiveFormsModule,
    MatDialogModule,
    LottieModule.forRoot({
      player: playerFactory,
      useCache: true,
    }),
    MatSnackBarModule,
    QRCodeModule,
    SocialLoginModule
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '297634053257-9lj4031crib13bc87hn8mj5tuf1mrurp.apps.googleusercontent.com'
          )
        }
      ]
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
