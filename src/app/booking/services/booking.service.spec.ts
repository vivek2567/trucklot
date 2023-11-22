import { TestBed } from '@angular/core/testing';

import { BookingService } from './booking.service';
import { APIService } from 'src/app/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { BookingListRequest } from '../models/booking.model';

describe('BookingService', () => {
  let service: BookingService;
  let apiService: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(BookingService);
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in successfully', (done: DoneFn) => {
    const req: BookingListRequest = {
      status: 1,
      pageSize: 1000,
      pageNumber: 1,
      timeZone: "USA"
    }
    const mockResponse = {
      id: "05fcb502-eb29-4078-c63f-08dbdf805c81",
      name: null,
      isHazardousLoad: false,
      startDate: "2023-11-07T11:10:00+00:00",
      endDate: "2023-11-07T11:25:00+00:00",
      duration: "15 minutes",
      amount: 8.5,
      discount: 0.55,
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.getBookingList(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe(response.id);
      done(); // Call done to handle asynchronous test
    });

  });
  it('should log in successfully', (done: DoneFn) => {
    const req = "05fcb502-eb29-4078-c63f-08dbdf805c81";

    const mockResponse = {
      id: "05fcb502-eb29-4078-c63f-08dbdf805c81",
      parkingArea: "12000 President Clinton Ave Parking",
      address: "Hillcrest Little Rock Pulaski County Arkansas United States",
      parkingSlot: "A01",
      duration: "15 minutes",
      arrivalTime: "Nov 07, 2023 - 11:10",
      departureTime: "Nov 07, 2023 - 11:25",
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getBookingDetailById(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe(response.id);
      expect(response.parkingArea).toBe('12000 President Clinton Ave Parking');
      expect(response.address).toBe('Hillcrest Little Rock Pulaski County Arkansas United States');
      done(); // Call done to handle asynchronous test
    });

  });
});

