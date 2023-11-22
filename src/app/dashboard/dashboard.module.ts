import { NgModule } from '@angular/core';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { DashboardRoutingModule } from './dashboard-routing.module';

//import { LayoutModule } from 'src/app/ui/layout/layout.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    CommonModule,
    DashboardRoutingModule,
    ButtonModule,
    //LayoutModule,
    DropdownModule,
    CheckboxModule,
    ChartModule,
 TabViewModule,
 TableModule,
 FormsModule

  ]
})
export class DashboardModule { }
