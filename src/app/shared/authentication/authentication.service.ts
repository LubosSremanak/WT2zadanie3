import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './model/user';
import {Account} from './model/account';
import {Login} from './model/login';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly url = 'controllers/';

  constructor(private http: HttpClient) {
  }

  public getTwoFACode(): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get(
      this.url + 'TwoFACreateCodeController.php',
      httpOptions
    );
  }

  public isCodeCorrect(secret: string, code: string): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.url + 'TwoFACheckCodeController.php',
      {secret, code},
      httpOptions
    );
  }

  public isEmailFree(email: string): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.url + 'CheckEmailDuplicityController.php',
      {email},
      httpOptions
    );
  }

  public registerUser(user: User, account: Account): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.url + 'RegisterUserController.php',
      {user, account},
      httpOptions
    );
  }

  public login(login: Login): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.url + 'LoginUserController.php',
      {login},
      httpOptions
    );
  }

  public createTimesStamp(email: string): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.url + 'CreateTimeStampController.php',
      {email},
      httpOptions
    );
  }

  public getTimesStampStats(email: string): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.url + 'LoginStatsController.php',
      {email},
      httpOptions
    );
  }


  public loginLDAP(login: Login): Observable<ArrayBuffer> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.url + 'LDAPLoginController.php',
      {login},
      httpOptions
    );
  }
}
