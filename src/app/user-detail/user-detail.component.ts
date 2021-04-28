import {Component, OnInit} from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {UserDetail} from './model/user-detail';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthenticationService} from '../shared/authentication/authentication.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  displayedColumnsAllStats: string[] = ['type', 'count'];
  displayedColumnsUserStats: string[] = ['timeStamp'];

  constructor(private googleAuthService: SocialAuthService,
              private authService: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this._dataSourceAllStats = [];
    this._dataSourceUserStats = [];
    this.matIconRegistry.addSvgIcon(
      'statsFlat',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/stats.svg'));
    this.showStatsState = false;
  }

  private _dataSourceAllStats: any[];
  get dataSourceAllStats(): any[] {
    return this._dataSourceAllStats;
  }

  private _dataSourceUserStats: any[];

  get dataSourceUserStats(): any[] {
    return this._dataSourceUserStats;
  }

  private _user: UserDetail;

  get user(): UserDetail {
    return this._user;
  }

  set user(value: UserDetail) {
    this._user = value;
  }

  private _showStatsState: boolean;

  get showStatsState(): boolean {
    return this._showStatsState;
  }

  set showStatsState(value: boolean) {
    this._showStatsState = value;
  }

  ngOnInit(): void {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  signOut(): void {
    try {
      this.googleAuthService.signOut().then();
    } catch (e) {

    }
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']).then(() => {
      this.snackBar.open('Logged out', 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    });
  }

  showStats(): void {
    this.authService.getTimesStampStats(this.user.email).subscribe((response) => {
      const data = JSON.parse(JSON.stringify(response));
      this._dataSourceAllStats = JSON.parse(data.allStats);
      this._dataSourceUserStats = JSON.parse(data.userStats);
      this.showStatsState = !this.showStatsState;
    });
  }
}
