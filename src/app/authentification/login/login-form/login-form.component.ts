import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthenticationService} from '../../../shared/authentication/authentication.service';
import {UserDetail} from '../../../user-detail/model/user-detail';
import {User} from '../../../shared/authentication/model/user';
import {Account} from '../../../shared/authentication/model/account';
import {LoginType} from '../../../shared/authentication/model/login-type.enum';
import {Login} from '../../../shared/authentication/model/login';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  constructor(private googleAuthService: SocialAuthService,
              private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
    this._twoFAState = false;
    this._stuLogin = false;
  }

  get twoFAState(): boolean {
    return this._twoFAState;
  }

  set twoFAState(value: boolean) {
    this._twoFAState = value;
  }

  get wrongPassword(): boolean {
    return this._wrongPassword;
  }

  set wrongPassword(value: boolean) {
    this._wrongPassword = value;
  }

  get stuLogin(): boolean {
    return this._stuLogin;
  }

  set stuLogin(value: boolean) {
    this._stuLogin = value;
  }

  get userDetail(): UserDetail {
    return this._userDetail;
  }

  set userDetail(value: UserDetail) {
    this._userDetail = value;
  }

  get emailCheck(): boolean {
    return this._emailCheck;
  }

  set emailCheck(value: boolean) {
    this._emailCheck = value;
  }

  get data(): FormGroup {
    return this._data;
  }

  set data(value: FormGroup) {
    this._data = value;
  }

  get codeCheck(): boolean {
    return this._codeCheck;
  }

  set codeCheck(value: boolean) {
    this._codeCheck = value;
  }

  get twoFACode(): string {
    return this._twoFACode;
  }

  set twoFACode(value: string) {
    this._twoFACode = value;
  }

  private _twoFAState: boolean;

  private _wrongPassword: boolean;

  private _stuLogin: boolean;

  private _userDetail: UserDetail;

  private _emailCheck: boolean;

  private _data: FormGroup;

  private _codeCheck: boolean;

  private _twoFACode: string;

  notSTU: boolean;

  alreadyReg: boolean;

  public createSnackBar(type: string): any {
    return {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type + '-snackbar']
    };
  }

  ngOnInit(): void {

    this._data = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)]),
      authCode: new FormControl('', []),
    });
  }

  onSubmit(data: FormGroup): void {
    if (data.valid) {
      if (this.stuLogin) {
        this.signInWithSTU();
      } else {
        this.checkEmail(data.value.email);
      }
    }
  }

  public successfulLogin(currentUser: UserDetail): void {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.authService.createTimesStamp(currentUser.email).subscribe(() => {
    });
    this.snackBar.open('Logged in', 'OK', this.createSnackBar('success'));
    this.router.navigate(['/userDetail']).then();
  }

  registerGoogle(userResponse: User, currentUser: UserDetail): void {
    const user: User = {name: userResponse.name, email: userResponse.email};
    const account: Account = {type: LoginType[LoginType.GOOGLE], password: null, googleId: userResponse.id, secret: null};
    this.authService.registerUser(user, account).subscribe(() => {
      this.successfulLogin(currentUser);
    });
  }

  signInWithGoogle(): void {
    this.stuLogin = true;
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((socialUser) => {
      this.authService.isEmailFree(socialUser.email).subscribe((emailResponse) => {
        const emailCheck = !!JSON.parse(JSON.stringify(emailResponse))[0];
        const currentUser: UserDetail = this.createCurrentUser(socialUser, socialUser.photoUrl);
        if (!emailCheck) {
          this.registerGoogle(socialUser, currentUser);
        } else {
          this.checkAlreadyRegisteredByType(emailResponse, LoginType.GOOGLE, currentUser);
        }
      });
    });
  }

  checkEmail(email: string): void {
    this.authService.isEmailFree(email).subscribe((response) => {
      const emailCheck = JSON.parse(JSON.stringify(response));
      this.emailCheck = !!emailCheck[0];

      if (!this.emailCheck) {
        this.data.controls.email.setErrors({notFree: true});
      } else {
        if (emailCheck[0].type === 'STU') {
          this.snackBar.open('Account is already registered by STU', 'OK', this.createSnackBar('warning'));
        }
        if (emailCheck[0].type === 'GOOGLE') {
          this.snackBar.open('Account is already registered by Google', 'OK', this.createSnackBar('warning'));
        }
        this.preLogin();
      }
    });
  }

  checkCode(event): void {
    this.authService.isCodeCorrect(this.twoFACode, event.target.value).subscribe((response) => {
      this.codeCheck = JSON.parse(JSON.stringify(response));
      if (!this.codeCheck) {
        this.data.controls.authCode.setErrors({notCorrect: true});
      }
    });
  }

  resetError(): void {
    this._wrongPassword = null;
  }

  preLogin(): void {
    this.authService.login(this.data.value).subscribe((response) => {
        const userData = JSON.parse(JSON.stringify(response));
        if (userData) {
          this._twoFAState = true;
          this.twoFACode = userData.secret;
          this.userDetail = this.createCurrentUser(userData);
        } else {
          this._wrongPassword = true;
          this.data.controls.password.setErrors({wrongPassword: true});
        }
      }
    );
  }

  loginCustom(): void {
    if (this.data.value.authCode.length < 1) {
      this.data.controls.authCode.setErrors({required: true});
    }
    if (this.data.valid) {
      this.successfulLogin(this.userDetail);

    }
  }

  returnLogin(): void {
    this.data.markAsPending();
    this.data.setValue({password: null, email: this.data.value.email, authCode: null});
    this._twoFAState = false;
    this.twoFACode = null;
    this.userDetail = null;
  }

  registerSTU(userResponse: User, currentUser: UserDetail): void {
    const user: User = {name: userResponse.name, email: userResponse.email};
    const account: Account = {type: LoginType[LoginType.STU], password: null, googleId: null, secret: null};
    this.authService.registerUser(user, account).subscribe(() => {
      this.successfulLogin(currentUser);
    });
  }

  checkAlreadyRegisteredByType(emailResponse: any, type: LoginType, currentUser: UserDetail): void {
    const typeResponse = JSON.parse(JSON.stringify(emailResponse))[0].type;
    if (typeResponse === LoginType[type]) {
      this.successfulLogin(currentUser);
    } else {
      this.snackBar.open('Account is already registered by another service ', 'OK', this.createSnackBar('warning'));
    }
  }

  createCurrentUser(user: User, photoUrl?: string): any {
    let url: string = 'https://eu.ui-avatars.com/api/?name=' + user.name + '?background=random';
    if (photoUrl) {
      url = photoUrl;
    }
    return {
      name: user.name,
      email: user.email,
      photoUrl: url
    };
  }

  signInWithSTU(): void {
    const login: Login = {name: this.data.value.email, password: this.data.value.password};
    this.authService.loginLDAP(login).subscribe((userResponse) => {
      if (JSON.parse(JSON.stringify(userResponse)) === 'Bind error') {
        this.data.controls.email.setErrors({notSTU: true});
        this.notSTU = true;

      } else {
        const userSTU: User = JSON.parse(JSON.stringify(userResponse));
        this.authService.isEmailFree(this.data.value.email + '@stuba.sk').subscribe((emailResponse) => {
          const emailCheck = !!JSON.parse(JSON.stringify(emailResponse))[0];
          const currentUser: UserDetail = this.createCurrentUser(userSTU);
          if (!emailCheck) {
            this.registerSTU(userSTU, currentUser);
          } else {
            const typeResponse = JSON.parse(JSON.stringify(emailResponse))[0].type;
            if (typeResponse === LoginType[LoginType.STU]) {
              this.successfulLogin(currentUser);
            } else {
              this.data.controls.email.setErrors({alreadyReg: true});
              this.alreadyReg = true;
            }
          }
        });
      }
    });
  }

  changeFormToSTU(): void {
    this.stuLogin = !this.stuLogin;
    if (this.stuLogin) {
      this.data.get('email').clearValidators();
      this.data.get('email').updateValueAndValidity();
      this.data.get('email').setValidators([Validators.required, Validators.minLength(4)]);
    } else {
      this.data.get('email').clearValidators();
      this.data.get('email').updateValueAndValidity();
      this.data.get('email').setValidators([Validators.required, Validators.email]);
    }

  }
}
