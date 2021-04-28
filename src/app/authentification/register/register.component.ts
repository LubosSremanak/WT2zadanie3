import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../shared/authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../shared/authentication/model/user';
import {Account} from '../../shared/authentication/model/account';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoginType} from '../../shared/authentication/model/login-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  private _codeCheck: boolean;

  get codeCheck(): boolean {
    return this._codeCheck;
  }

  set codeCheck(value: boolean) {
    this._codeCheck = value;
  }

  private _emailCheck: boolean;

  get emailCheck(): boolean {
    return this._emailCheck;
  }

  set emailCheck(value: boolean) {
    this._emailCheck = value;
  }

  private _data: FormGroup;

  get data(): FormGroup {
    return this._data;
  }

  set data(value: FormGroup) {
    this._data = value;
  }

  private _twoFACode: string;

  get twoFACode(): string {
    return this._twoFACode;
  }

  set twoFACode(value: string) {
    this._twoFACode = value;
  }

  private _qrCode: string;

  get qrCode(): string {
    return this._qrCode;
  }

  set qrCode(value: string) {
    this._qrCode = value;
  }

  ngOnInit(): void {
    this.getCode();
    this._data = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(1)]),
      surname: new FormControl('', [
        Validators.required,
        Validators.minLength(1)]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)]),
      passwordRepeat: new FormControl('', [
        Validators.required]
      ),
      authCode: new FormControl('', [
        Validators.required]
      ),
    }, {validators: this.checkPasswords});
  }

  checkPasswords(group: FormGroup): { notSame: boolean } {
    const password = group.controls.password.value;
    const confirmPassword = group.controls.passwordRepeat.value;
    const check: any = password === confirmPassword ? null : {notSame: true};
    if (check) {
      group.controls.passwordRepeat.setErrors({notSame: true});
    }
    return password === confirmPassword ? null : {notSame: true};
  }

  public getCode(): void {
    this.route.data.subscribe(data => {
      const twoFA = JSON.parse(JSON.stringify(data.codeTwoFA));
      this.twoFACode = twoFA.code;
      this.qrCode = twoFA.url;
    });
  }


  public onSubmit(data: FormGroup): void {
    if (data.valid && this.codeCheck) {
      const user: User = {name: this.createName(data), email: data.value.email};
      const account: Account = {type: LoginType[LoginType.CUSTOM], password: data.value.password, googleId: null, secret: this.twoFACode};
      this.authService.registerUser(user, account).subscribe(() => {
        this.snackBar.open('Registered', 'OK', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['']).then();
      });
    }
  }

  public createName(data: FormGroup): string {
    const name: string = data.value.name;
    const surname: string = data.value.surname;
    return name + ' ' + surname;
  }

  checkCode(event): void {
    this.authService.isCodeCorrect(this.twoFACode, event.target.value).subscribe((response) => {
      this.codeCheck = JSON.parse(JSON.stringify(response));
      if (!this.codeCheck) {
        this.data.controls.authCode.setErrors({notCorrect: true});
      }
    });
  }


  checkEmail(event): void {
    this.authService.isEmailFree(event.target.value).subscribe((response) => {
      const emailCheck = JSON.parse(JSON.stringify(response));
      this.emailCheck = !!emailCheck[0];
      if (this.emailCheck) {
        this.data.controls.email.setErrors({notFree: true});
      }
    });
  }
}
