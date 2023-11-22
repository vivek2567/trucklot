import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookingService } from '../../services/booking.service';


@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss']
})
export class ViewBookingComponent {
  bookingId: string = '';
  imagePath: string = '';
  bookingDetails: any = {};
  arrival: string = '';
  departure: string = '';
  showLoader = true;

  constructor(public ref: DynamicDialogRef, private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingId = this.bookingService.setid()
    this.getBookingDetailById();
  }

  getBookingDetailById() {
    this.bookingService.getBookingDetailById(this.bookingId).subscribe(
      {
        next: (response) => {
          this.bookingDetails = response;
          this.showLoader = this.bookingDetails.parkingLayout ? true : false;
          this.arrival = response.arrivalTime;
          this.departure = response.departureTime;
        }
      })
  }

  getArrivalDate() {
    return this.bookingDetails?.arrivalTime?.split(' - ')[0];
  }
  getArrivalTime() {
    return this.bookingDetails?.arrivalTime?.split(' - ')[1];
  }

  getDepartureDate() {
    return this.bookingDetails?.departureTime?.split(' - ')[0];
  }
  getDepartureTime() {
    return this.bookingDetails?.departureTime?.split(' - ')[1];
  }

  sameDay(): boolean {
    const arrival = this.bookingDetails?.arrivalTime?.split(' - ')[0];
    const departure = this.bookingDetails?.departureTime?.split(' - ')[0];
    if (arrival == departure) {
      return false;
    }
    else {
      return true;
    }
  }


  cancelDialog() {
    this.ref.close();
  }
}
