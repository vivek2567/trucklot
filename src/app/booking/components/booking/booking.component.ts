import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { BookingService } from '../../services/booking.service';
import { ViewBookingComponent } from '../view-booking/view-booking.component';
import { LoaderService, Utility } from 'src/app/shared';
import { SignalRService } from 'src/app/shared/services/signal-r.service';
import { Booking, BookingListRequest, BookingListResponse, BookingType, TabName } from '../../models/booking.model';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  constructor(
    private bookingService: BookingService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private signalRService: SignalRService) {

  }
  first = 1;
  totalItemsUpcoming!: number;
  totalItemsPast!: number;
  totalItemsCurrent!: number;
  rowsPerPageOptions = [5, 10, 15, 20];
  itemsPerPageUpcoming !: number; //upcoming
  itemsPerPagePast!: number;  //past
  itemsPerPageCurrent!: number;  //current
  paginatedItems: Booking[] = [];
  paginatedItems2: Booking[] = [];
  paginatedItems3: Booking[] = [];

  currentPageUpcoming = 1
  currentPagePast = 1;
  currentPageCurrent = 1;

  pageSize = 0;
  activeIndex = 0;
  pastBooking: Booking[] = [];
  upcomingBooking: Booking[] = [];
  currentBooking: Booking[] = [];
  activeLink = 'Current';

  ngOnInit(): void {
    this.loaderService.hideLoader();
    this.getCurrentBooking();

    this.signalRService.isNotificationTrigger().subscribe((res: boolean) => {
      if (res == true) {
        this.setActiveTab(BookingType.Current);
      }
    })


  }


  setActiveTab(index: number) {
    this.activeIndex = index;
    if (this.activeIndex == 0) {
      this.activeLink = 'Current';
      this.getCurrentBooking();
    }
    else if (this.activeIndex == 1) {
      this.activeLink = 'Upcoming';
      this.getUpcomingBooking();
    }
    else {
      this.activeLink = 'Past';
      this.getPastBooking();
    }
  }

  getCurrentBooking() {
    const request: BookingListRequest = {
      status: BookingType.Current,
      pageSize: 10,
      pageNumber: this.currentPageCurrent,
      timeZone: Utility.getLocalTimeZone()
    }
    this.loaderService.showLoader();
    this.bookingService.getBookingList(request)
      .subscribe(
        {
          next: (response: BookingListResponse) => {
            this.currentBooking = response.bookingList;
            this.totalItemsCurrent = response.totalRecords;
            this.itemsPerPageCurrent = 10;
            // this.paginateItemsCurrent(this.currentPageCurrent);
            this.loaderService.hideLoader();
          },
          error: () => {
            this.loaderService.hideLoader();
            this.currentBooking = [];
          }
        })
  }

  getUpcomingBooking() {
    const request: BookingListRequest = {
      status: BookingType.Upcoming,
      pageSize: 10,
      pageNumber: this.currentPageUpcoming,
      timeZone: Utility.getLocalTimeZone()
    }
    this.loaderService.showLoader();
    this.bookingService.getBookingList(request).subscribe({
      next: (response: BookingListResponse) => {
        this.upcomingBooking = response.bookingList;
        this.totalItemsUpcoming = response.totalRecords
        this.itemsPerPageUpcoming = 10;
        this.paginateItemsUpcoming(this.currentPageUpcoming);
        this.loaderService.hideLoader();
      },
      error: () => {
        this.upcomingBooking = [];
        this.loaderService.hideLoader();
      }
    })
  }

  getPastBooking() {
    const request: BookingListRequest = {
      status: BookingType.Past,
      pageSize: 10,
      pageNumber: this.currentPagePast,
      timeZone: Utility.getLocalTimeZone()
    }
    this.loaderService.showLoader();
    this.bookingService.getBookingList(request).subscribe({
      next: (response: BookingListResponse) => {
        this.pastBooking = response.bookingList;
        this.totalItemsPast = response.totalRecords;
        this.itemsPerPagePast = 10;
        this.paginateItemsPast(this.currentPagePast);
        this.loaderService.hideLoader();
      },
      error: () => {
        this.pastBooking = [];
        this.loaderService.hideLoader();
      }
    })
  }


  openBookingDetails(bookingId: string) {
    this.bookingService.getid(bookingId)
    const ref = this.dialogService.open(ViewBookingComponent, {
      width: '45%',
      height: '100%'
    });
  }

  onPageChangeUpcoming(event: any) {

    this.currentPageUpcoming = event.page + 1;
    this.getUpcomingBooking();
    //this.paginateItemsUpcoming(event.page + 1); // Page number starts from 0, but we want it to start from 1
  }
  paginateItemsUpcoming(page: number) {
    const startIndex = this.itemsPerPageUpcoming * (page - 1);
    this.paginatedItems = this.upcomingBooking;
    // this.paginatedItems = this.upcomingBooking.slice(startIndex, startIndex + this.itemsPerPageUpcoming);
  }


  onPageChangePast(event: any) {
    this.currentPagePast = event.page + 1;
    this.getPastBooking();
  }
  paginateItemsPast(page: number) {

    const startIndex = this.itemsPerPagePast * (page - 1);
    this.paginatedItems2 = this.pastBooking;
  }

  onPageChangeCurrent(event: any) {
    this.currentPageCurrent = event.page + 1;
    this.getCurrentBooking();
  }
  paginateItemsCurrent(page: number) {

    const startIndex = this.itemsPerPageCurrent * (page - 1);
    this.paginatedItems3 = this.currentBooking;
  }
  showComingSoonMessage(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'info', summary: 'info', detail: 'Coming Soon' });
  }

}
