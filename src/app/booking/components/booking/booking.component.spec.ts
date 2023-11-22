import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingComponent } from './booking.component';
import { APIService } from 'src/app/shared';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BookingService } from '../../services/booking.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BookingListResponse } from '../../models/booking.model';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let bookingService: BookingService;
  const mockBookingList: BookingListResponse =
  {
    totalRecords: 1,
    bookingList: [{
      id: "QWERTH-!#$",
      isHazardousLoad: false,
      driverName: "test driver",
      location: "USA",
      bookingDate: "11/10/2023",
      slotName: "test slot",
      total: 5,
      createdBy: "QWERTH-!#$-1234",
      startDate: new Date(),
      endDate: new Date(),
    }]
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingComponent],
      providers: [APIService, HttpClient, HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "123" }) // Replace '123' with the desired parameter value
          }
        }],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set activeIndex and activeLink to "Current" when index is 0', () => {
    component.setActiveTab(0);
    expect(component.activeIndex).toBe(0);
    expect(component.activeLink).toBe('Current');
  });
  it('should set activeIndex and activeLink to "Upcoming" when index is 1', () => {
    component.setActiveTab(1);
    expect(component.activeIndex).toBe(1);
    expect(component.activeLink).toBe('Upcoming');
  });

  it('should set activeIndex and activeLink to "Past" when index is not 0 or 1', () => {
    component.setActiveTab(2); // Assuming index 2 is not 0 or 1
    expect(component.activeIndex).toBe(2);
    expect(component.activeLink).toBe('Past');
  });

  it('should populate currentBooking when data is retrieved successfully', () => {
    spyOn(bookingService, 'getBookingList').and.returnValue(
      // Simulate a successful response with some test data
      of(mockBookingList)
    );

    component.getCurrentBooking();

    // Expectations
    expect(component.currentBooking.length).toBeGreaterThan(0);
    expect(component.totalItemsCurrent).toBe(component.currentBooking.length);
    expect(component.itemsPerPageCurrent).toBe(10);
  });

  it('should handle errors when data retrieval fails', () => {
    spyOn(bookingService, 'getBookingList').and.returnValue(
      // Simulate an error response
      throwError(() => new Error('Failed to retrieve data'))
    );

    component.getCurrentBooking();

    // Expectations
    expect(component.currentBooking.length).toBe(0);
    // You can add additional error handling expectations if needed
  });

});
