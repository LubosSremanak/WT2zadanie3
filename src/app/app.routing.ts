import {AuthenticationComponent} from './authentification/authentication.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {RegisterComponent} from './authentification/register/register.component';
import {TwoFACodeResolver} from './authentification/register/resolver/two-facode.resolver';
import {AuthenticationGuard} from './shared/authentication/quard/authentication.guard';
import {LoginReturnGuard} from './shared/authentication/quard/login-return.guard';

export const AppRoutes: any = [
  {
    path: '', component: AuthenticationComponent, canActivate: [AuthenticationGuard],
  },
  {path: 'userDetail', component: UserDetailComponent, canActivate: [LoginReturnGuard]},
  {
    path: 'register', component: RegisterComponent, canActivate: [AuthenticationGuard],
    resolve: {
      codeTwoFA: TwoFACodeResolver
    }
  },
  {path: '**', component: AuthenticationComponent, canActivate: [AuthenticationGuard]}
];

export const AppComponents: any = [];
