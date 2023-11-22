import { NgModule } from '@angular/core';

import { ManagerRoutingModule } from './manager-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ProfileComponent,
    CompanyDetailsComponent
  ],
  imports: [
    SharedModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
