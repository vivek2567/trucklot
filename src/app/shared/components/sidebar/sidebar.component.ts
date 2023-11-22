import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(0)' })),
      state('left', style({ width: '50px' })),
      transition('* => *', animate('300ms ease-in-out')),
    ]),
  ]
})
export class SidebarComponent {

  constructor(private router: Router, private layoutService: LayoutService) {


  }

  // get sidebarDirection() {
  //   return this.layoutService.getAnimationDirection();
  // }
  get isSidebarOpen(): boolean { return this.layoutService.isSidebarOpen; }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl("manager-login");
  }

}