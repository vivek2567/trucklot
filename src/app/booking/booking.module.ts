import { NgModule } from '@angular/core';

import { BookingRoutingModule } from './booking-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ViewBookingComponent } from './components/view-booking/view-booking.component';
import { BookingComponent } from './components/booking/booking.component';


@NgModule({
  declarations: [
    BookingComponent,
    ViewBookingComponent
  ],
  imports: [
    SharedModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
