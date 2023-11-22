import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared';
import { authGuard } from './core';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'terms-of-service',
    component: TermsConditionComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'manager-login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'manager',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
        canActivate: [authGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [authGuard]
      },
      {
        path: 'booking',
        loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
        canActivate: [authGuard]
      },
      {
        path: 'parking',
        loadChildren: () => import('./parking-lot/parking-lot.module').then(m => m.ParkingLotModule),
        canActivate: [authGuard]
      },
      {
        path: 'transaction',
        loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
        canActivate: [authGuard]
      },
      {
        path: 'messages',
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
        canActivate: [authGuard]
      },
      {
        path: 'reviews',
        loadChildren: () => import('./review/review.module').then(m => m.ReviewModule),
        canActivate: [authGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
