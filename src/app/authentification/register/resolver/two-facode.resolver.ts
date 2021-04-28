import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../../../shared/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TwoFACodeResolver implements Resolve<ArrayBuffer> {
  constructor(private authService: AuthenticationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ArrayBuffer> {
    return this.authService.getTwoFACode();
  }
}
