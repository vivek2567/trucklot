import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBookingComponent } from './components/view-booking/view-booking.component';
import { BookingComponent } from './components/booking/booking.component';

const routes: Routes = [
  {
    path: '',
    component: BookingComponent
  },
  {
    path: 'viewBooking',
    component: ViewBookingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
