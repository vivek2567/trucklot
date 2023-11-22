import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookingComponent } from './view-booking.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { APIService } from 'src/app/shared';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookingService } from '../../services/booking.service';
import { of } from 'rxjs';

describe('ViewBookingComponent', () => {
  let component: ViewBookingComponent;
  let fixture: ComponentFixture<ViewBookingComponent>;
  let bookingService: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBookingComponent],
      providers: [APIService, HttpClient, HttpHandler, DynamicDialogRef],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(ViewBookingComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should populate bookingDetails when data is retrieved successfully', () => {
    const fakeResponse = {
      driverDetail: "test driver",
      // Define your fake response data here
      arrivalTime: '2023-11-07T10:00:00',
      departureTime: '2023-11-07T12:00:00',
      // Add other properties as needed
    };

    spyOn(bookingService, 'getBookingDetailById').and.returnValue(
      // Simulate a successful response with your fake data
      of(fakeResponse)
    );

    component.getBookingDetailById();

    // Expectations
    expect(component.bookingDetails).toEqual(fakeResponse);
    expect(component.arrival).toBe(fakeResponse.arrivalTime);
    expect(component.departure).toBe(fakeResponse.departureTime);
  });

  it('should return the correct arrival date when bookingDetails is available', () => {
    // Set up the bookingDetails with a sample arrivalTime
    component.bookingDetails = {
      arrivalTime: '2023-11-07 - 10:00 AM' // Replace with your test data
    };

    const result = component.getArrivalDate();

    // Expectations
    expect(result).toBe('2023-11-07');
  });

  it('should return undefined when bookingDetails is not available', () => {
    // Ensure that bookingDetails is not set

    const result = component.getArrivalDate();

    // Expectations
    expect(result).toBeUndefined();
  });

  it('should return undefined when arrivalTime is not available in bookingDetails', () => {
    // Set up the bookingDetails without an arrivalTime
    component.bookingDetails = {
      // Other properties without arrivalTime
    };

    const result = component.getArrivalDate();

    // Expectations
    expect(result).toBeUndefined();
  });
  it('should return the correct arrival time when bookingDetails is available', () => {
    // Set up the bookingDetails with a sample arrivalTime
    component.bookingDetails = {
      arrivalTime: '2023-11-07 - 10:00 AM' // Replace with your test data
    };

    const result = component.getArrivalTime();

    // Expectations
    expect(result).toBe('10:00 AM');
  });
  it('should return undefined when bookingDetails is not available', () => {
    // Ensure that bookingDetails is not set

    const result = component.getArrivalTime();

    // Expectations
    expect(result).toBeUndefined();
  });

  it('should return undefined when arrivalTime is not available in bookingDetails', () => {
    // Set up the bookingDetails without an arrivalTime
    component.bookingDetails = {
      // Other properties without arrivalTime
    };

    const result = component.getArrivalTime();

    // Expectations
    expect(result).toBeUndefined();
  });

  // Add more test cases to cover different scenarios, such as handling different time formats or components.
});