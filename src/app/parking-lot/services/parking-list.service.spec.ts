import { TestBed } from '@angular/core/testing';

import { ParkingListService } from './parking-list.service';
import { APIService } from 'src/app/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { ParkingListRequest } from '../models/parking-list.model';

describe('ParkingListService', () => {
  let service: ParkingListService;
  let apiService: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(ParkingListService);
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //----------------------getParkingLotsByManagerId-------------------------------------------------------
  it('getParkingLotsByManagerId successfully tested', (done: DoneFn) => {

    const parkingListRequest: ParkingListRequest = {
      search: "",
      pageNumber: 1,
      pageSize: 10
    }
    const mockResponse = {
      id: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c",
      name: "Pendergrass Park",
      parkingLocation: "138 North Holland Drive,Pendergrass,GA,USA",
      numberOfSlots: 156,
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.getParkingLotsByManagerId(parkingListRequest).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe("a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c");
      expect(response.name).toBe("Pendergrass Park");
      done(); // Call done to handle asynchronous test
    });
  });

  //----------------------getParkingLotsById-------------------------------------------------------
  it('getParkingLotsById successfully tested', (done: DoneFn) => {
    const req = {
      id: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c"
    }
    const mockResponse = {
      id: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c",
      name: "Pendergrass Park",
      hazardousLoadRate: 5,
      offer: 10,
      rating: 3.2,
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getParkingLotsById(req.id).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe("a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c");
      expect(response.name).toBe("Pendergrass Park");
      expect(response.offer).toBe(10);
      done(); // Call done to handle asynchronous test
    });
  });

  //----------------------getParkingLotDetailsWithSlots-------------------------------------------------------
  it('getParkingLotDetailsWithSlots successfully tested', (done: DoneFn) => {
    const req = {
      parkingLotId: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c"
    }
    const mockResponse = {
      vehicleTypeId: "c88c02a0-591e-4f59-87d0-31a1fdcdd8e1",
      vehicleName: "Tanker",
      slots: [
        {
          id: "d476f70e-ee97-49f0-43d2-08dbd0ad2c8f",
          slotName: "A01"
        }
      ]
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getParkingLotsById(req.parkingLotId).subscribe((response: any) => {
      // Check for the successful response
      expect(response.vehicleTypeId).toBe("c88c02a0-591e-4f59-87d0-31a1fdcdd8e1");
      expect(response.vehicleName).toBe("Tanker");
      expect(response.slots).toBe(mockResponse.slots);
      done(); // Call done to handle asynchronous test
    });
  });


  //----------------------searchParkingList-------------------------------------------------------
  it('searchParkingList successfully tested', (done: DoneFn) => {
    const req = {
      item: "Pendergrass Park"
    }
    const mockResponse = {
      name: "Pendergrass Park",
      parkingLocation: "138 North Holland Drive,Pendergrass,GA,USA",
      numberOfSlots: 156,
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getParkingLotsById(req.item).subscribe((response: any) => {
      // Check for the successful response
      expect(response.name).toBe("Pendergrass Park");
      expect(response.parkingLocation).toBe("138 North Holland Drive,Pendergrass,GA,USA");
      expect(response.numberOfSlots).toBe(156);
      done(); // Call done to handle asynchronous test
    });
  });
});
