import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {LottieAnimationsService} from '../shared/lottie-animations/service/lottie-animations.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer, private lottieService: LottieAnimationsService) {
    this.matIconRegistry.addSvgIcon(
      'googleLogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/googleLogo.svg'));
    this.matIconRegistry.addSvgIcon(
      'stuLogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/stuLogo.svg'));
    this.matIconRegistry.addSvgIcon(
      'statsFlat',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/stats.svg'));
  }


  ngOnInit(): void {

  }


}
