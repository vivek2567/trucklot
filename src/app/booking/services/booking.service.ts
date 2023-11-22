import { Injectable } from '@angular/core';
import { APIService, Utility } from 'src/app/shared';
import { BookingListRequest, BookingListResponse } from '../models/booking.model';



@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private bookingId = '';


  constructor(private apiService: APIService) { }



  getBookingList(data: BookingListRequest) {
    return this.apiService.post<BookingListResponse>('BookingSlot/GetBookingListByManagerId', data);
  }

  getid(id: string) {
    this.bookingId = id;
  }
  setid() {
    return this.bookingId
  }

  getBookingDetailById(bookingId: string) {
    const timeZone = Utility.getLocalTimeZone();
    return this.apiService.get<any>(`BookingSlot/getBookingDetailById?id=${bookingId}&timeZone=${timeZone}`);
  }
}
