import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ParkingLotRoutingModule } from './parking-lot-routing.module';
import { MapsComponent } from './components/maps/maps.component';
import { ParkingSlotsComponent } from './components/parking-slots/parking-slots.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { EditParkingComponent } from './components/edit-parking/edit-parking.component';
import { ParkingListComponent } from './components/parking-list/parking-list.component';
import { SharedModule } from '../shared/shared.module';
import { ViewParkingComponent } from './components/view-parking/view-parking.component';
import { CreateParkingComponent } from './components/create-parking/create-parking.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditParkingSlotComponent } from './components/edit-parking-slot/edit-parking-slot.component';
import { MapAutoCompleteDirective } from './directive/map-auto-complete.directive';


@NgModule({
  declarations: [
    CreateParkingComponent,
    MapsComponent,
    ParkingSlotsComponent,
    SuccessModalComponent,
    EditParkingComponent,
    ParkingListComponent,
    ViewParkingComponent,
    EditParkingSlotComponent,
    MapAutoCompleteDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParkingLotRoutingModule,
    MultiSelectModule
  ],
  providers: [DatePipe]
})
export class ParkingLotModule { }
