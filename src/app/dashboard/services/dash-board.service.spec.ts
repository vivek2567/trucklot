import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dash-board.service';
import { APIService, ApiResponse } from 'src/app/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';


describe('DashBoardService', () => {
  let service: DashboardService;
  let apiService: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(DashboardService);
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getParkingLotByStatesName successfully', (done: DoneFn) => {
    const req = {
      stateName: "GA"
    };

    const mockResponse = {
      id: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c",
      name: "Pendergrass Park",
      latitude: 34.1529365,
      longitude: -83.6651734
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getParkingLotByStatesName(req.stateName).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe(mockResponse.id);
      expect(response.name).toBe('Pendergrass Park');
      done(); // Call done to handle asynchronous test
    });

  });

  it('should getParkingLotsStates successfully', (done: DoneFn) => {
    // const req = "05fcb502-eb29-4078-c63f-08dbdf805c81";

    const mockResponse = {
      message: "ParkingLot states fetched successfully",
      status: true,
      data: [
        "Arizona",
        "Arkansas",
        "GA",
        "Georgia",
        "Kansas",
        "Punjab",
        "San Luis Potosí",
        "Texas"
      ]
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getParkingLotsStates().subscribe((response: any) => {
      // Check for the successful response
      //expect(response.id).toBe(response.id);
      expect(response.status).toBe(true);
      done(); // Call done to handle asynchronous test
    });

  });
  it('should getReviewsByParkingLotId successfully', (done: DoneFn) => {
    const req = {
      state: "GA"
    };

    const mockResponse: ApiResponse<any> = {
      message: "successfully",
      status: true,
      data: {
        parkingLotId: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c",
        review: "Avoid this place while construction is occurring nearby. Waited over 45 minutes to try and park here. ",
        reviewBy: "David Taylor",
        rating: 2,
        parkingLotRating: 3.2,
        name: "Pendergrass Park"
      }
    }
    spyOn(apiService, 'getWithAllResponse').and.returnValue(of(mockResponse));
    service.getReviewsByParkingLotId(req.state).subscribe((response: any) => {
      // Check for the successful response
      expect(response.data.parkingLotId).toBe('a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c');
      expect(response.status).toBeTruthy();
      expect(response.data.reviewBy).toBe('David Taylor');
      done(); // Call done to handle asynchronous test
    });

  });

  it('should getAllBookingEarningDetails successfully', (done: DoneFn) => {
    const req = {
      state: "GA"
    };

    const mockResponse = {
      message: "Data fetched successfully",
      status: true,
      data: {
        totalBookings: 26,
        totalEarning: 246.12,
        peakHoursStartTime: "3:00 PM",
        peakHoursEndTime: "5:00 PM"
      }
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getAllBookingEarningDetails(req.state).subscribe((response: any) => {
      // Check for the successful response
      expect(response.data.totalEarning).toBe(246.12);
      expect(response.status).toBeTruthy();
      done(); // Call done to handle asynchronous test
    });

  });

  it('should getTruckTypesByParkingLotId successfully', (done: DoneFn) => {
    const req = {
      id: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c"
    };

    const mockResponse = {
      message: "Truck types fetched successfully",
      status: true,
      data: [
        {
          parkingLotId: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c",
          name: "Tractor Only",
          vehicleTypeImagePath: "test.jpg",
          fareChargesHourly: 2.75,
          fareChargesNight: 3.25,
          fareChargesWeekly: 73.75
        }
      ]
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getTruckTypesByParkingLotId(req.id).subscribe((response: any) => {
      // Check for the successful response
      expect(response.data).toBe(mockResponse.data);
      expect(response.status).toBeTruthy();
      done(); // Call done to handle asynchronous test
    });

  });

  // it('should getParkingLotSurveyOverall successfully', (done: DoneFn) => {
  //   const req = {
  //     range: 1,
  //     id: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c",
  //     state: "GA"
  //   };

  //   const mockResponse = {
  //     message: "Data fetched successfully for today",
  //     status: true,
  //     data: {
  //       occupancyRate: 0,
  //       vacant: 100
  //     }
  //   }
  //   spyOn(apiService, 'get').and.returnValue(of(mockResponse));
  //   service.getParkingLotSurveyOverall(req.range, req.id, req.state).subscribe((response: any) => {
  //     // Check for the successful response
  //     expect(response.data).toBe(mockResponse.data);
  //     done(); // Call done to handle asynchronous test
  //   });

  // });

  // it('should getParkingLotSurveyOverallRecord successfully', (done: DoneFn) => {
  //   const req = {
  //     range: 1,
  //     state: "GA"
  //   };

  //   const mockResponse = {
  //     message: "Data fetched successfully for today",
  //     status: true,
  //     data: {
  //       occupancyRate: 0,
  //       vacant: 100
  //     }
  //   }
  //   spyOn(apiService, 'get').and.returnValue(of(mockResponse));
  //   service.getParkingLotSurveyOverallRecord(req.range, req.state).subscribe((response: any) => {
  //     // Check for the successful response
  //     expect(response.data).toBe(mockResponse.data);
  //     expect(response.status).toBeTruthy();
  //     done(); // Call done to handle asynchronous test
  //   });

  // });

});
