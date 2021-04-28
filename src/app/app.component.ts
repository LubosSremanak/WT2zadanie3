import {Component, HostListener, OnInit} from '@angular/core';
import {LottieAnimationsService} from './shared/lottie-animations/service/lottie-animations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  private innerWidth: number;


  constructor(private lottieService: LottieAnimationsService) {
  }

  public isMobile(): boolean {
    return this.innerWidth <= 960;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  mainAnimation(): void {

  }

  mobileAnimation(): void {
  }

  birdsAnimation(): void {
    const animationBirds = this.lottieService.getAnimationById('bgBirds');
    animationBirds.setSpeed(0.6);
  }
}
