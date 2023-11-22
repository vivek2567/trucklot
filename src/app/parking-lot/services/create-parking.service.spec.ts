import { TestBed } from '@angular/core/testing';

import { CreateParkingService } from './create-parking.service';
import { APIService } from 'src/app/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { CreateParkingRequest } from '../models/create-parking-request.model';
import { EditParkingRequest } from '../models/edit-parking-request.model';

describe('CreateParkingService', () => {
  let service: CreateParkingService;
  let apiService: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(CreateParkingService);
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //----------------------getVehicleTypeList-------------------------------------------------------
  it('getVehicleTypeList successfully tested', (done: DoneFn) => {
    const mockResponse = {
      message: "Vehicles has been fetched successfully",
      status: true,
      data: [
        {
          id: "c88c02a0-591e-4f59-87d0-31a1fdcdd8e1",
          name: "Tanker",
          vehicleTypeImagePath: "test.jpg",
        }
      ]
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getVehicleTypeList().subscribe((response: any) => {
      // Check for the successful response
      expect(response.message).toBe(mockResponse.message);
      expect(response.status).toBe(mockResponse.status);
      expect(response.data).toBe(mockResponse.data);
      done(); // Call done to handle asynchronous test
    });
  });

  //----------------------createParkingLot-------------------------------------------------------
  it('createParkingLot successfully tested', (done: DoneFn) => {

    const req: CreateParkingRequest = {

      name: "NewTestParkingLot",
      hazardousLoadRate: 5,
      offer: 10,
      rating: 4.3,
      companyLogo: "https://i.pinimg.com/originals/f4/cf/ec/f4cfec4f3b4bbf24798b26aa4a5508f2.png",
      taxAndFees: 10,
      parkingLotLayout: "",
      totalNumberOfSlots: 3,
      aboutUs: "qwerty asfs vxvcx",
      location:
      {
        country: "US",
        state: "Arkansas",
        latitude: 34.75526757290035,
        longitude: -92.27539582994251,
        address: "628 W Broadway St, North Little Rock, AR 72114",
        streetView: "cfgvh"
      }
      ,
      truckType: [
        {

          vehicleTypeId: "AF28BF9C-803B-4406-9737-4D9E46AF3076",
          fareChargesHourly: 5.2,
          fareChargesNight: 6.0,
          fareChargesWeekly: 982,
          overStayChargesTimeSlot1: 3.2,
          overStayChargesTimeSlot2: 4.8,
          overStayChargesTimeSlot3: 5.4,
          numberOfSlots: 3
        }
      ],
      parkingLotFacility: [
        {

          facilityId: "D3E312F5-5657-4562-ACB3-29F5E747C17D"
        },
        {

          facilityId: "9A86BA8F-F3E9-4B5D-AF77-4A412271AFF9"
        }

      ],
      parkingLotImages: [
        {
          imagePath: "https://th.bing.com/th?id=OIP.i8lefZ_SlO9puYT5GxrfKQHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
        },
        {
          imagePath: "https://th.bing.com/th?id=OIP.JepzZwk7QQ-okz18-I2VfAHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
        }
      ],
      parkingLotSlots: [
        {
          vehicleTypeId: "AF28BF9C-803B-4406-9737-4D9E46AF3076",
          slotName: "C01"
        },
        {
          vehicleTypeId: "AF28BF9C-803B-4406-9737-4D9E46AF3076",
          slotName: "C02"
        },
        {
          vehicleTypeId: "AF28BF9C-803B-4406-9737-4D9E46AF3076",
          slotName: "C03"
        }
      ]
    }

    const mockResponse = {
      id: "e3aeb4e4-b51f-46d4-6cc8-08dbe01e9ed2",
      name: "NewTestParkingLot",
      hazardousLoadRate: 5,
      offer: 10,
      rating: 4.3,
      companyLogo: "https://i.pinimg.com/originals/f4/cf/ec/f4cfec4f3b4bbf24798b26aa4a5508f2.png",
      aboutUs: "qwerty asfs vxvcx",
      parkingLotLayout: "",
      totalNumberOfSlots: 3,
      taxAndFees: 10,
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.createParkingLot(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe("e3aeb4e4-b51f-46d4-6cc8-08dbe01e9ed2");
      expect(response.name).toBe("NewTestParkingLot");
      expect(response.companyLogo).toBe("https://i.pinimg.com/originals/f4/cf/ec/f4cfec4f3b4bbf24798b26aa4a5508f2.png");
      done(); // Call done to handle asynchronous test
    });
  });

  //----------------------getFacilityList-------------------------------------------------------
  it('getFacilityList successfully tested', (done: DoneFn) => {

    const mockResponse = {
      message: "Facility fetched successfully",
      status: true,
      data: [
        {
          id: "d3e312f5-5657-4562-acb3-29f5e747c17d",
          facilityName: "Security Gate"
        },
        {
          id: "9a86ba8f-f3e9-4b5d-af77-4a412271aff9",
          facilityName: "Truck Washing"
        },
        {
          id: "55d88454-029d-400c-8ed2-82b600a56657",
          facilityName: "Lighting"
        },
        {
          id: "6c4c019b-c36a-45d2-920c-b1ef06b4878b",
          facilityName: "CCTV"
        }
      ]
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getFacilityList().subscribe((response: any) => {
      // Check for the successful response
      expect(response.message).toBe(mockResponse.message);
      expect(response.status).toBe(mockResponse.status);
      expect(response.data).toBe(mockResponse.data);
      done(); // Call done to handle asynchronous test
    });
  });

  //----------------------getFacilityList-------------------------------------------------------
  it('ImageUpload successfully tested', (done: DoneFn) => {
    const req = [
      {
        Image: "Screenshot 2023-06-29 190644.png"
      }
    ]
    const mockResponse = {
      message: "Images saved successfully",
      status: true,
      data: {
        "Screenshot 2023-06-29 190644.png": "test.jpg",
      }
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.imageUplaod(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.message).toBe(mockResponse.message);
      expect(response.status).toBe(mockResponse.status);
      expect(response.data).toBe(mockResponse.data);
      done(); // Call done to handle asynchronous test
    });
  });


  //----------------------getparkingDetailById------------------------------------------------------------
  it('getparkingDetailById successfully tested', (done: DoneFn) => {
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
    service.getparkingDetailById(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.hazardousLoadRate).toBe(mockResponse.hazardousLoadRate);
      expect(response.name).toBe(mockResponse.name);
      expect(response.id).toBe(mockResponse.id);
      done(); // Call done to handle asynchronous test
    });
  });


  //----------------------getparkingDetailById------------------------------------------------------------
  it('editParkingLot successfully tested', (done: DoneFn) => {
    const req: EditParkingRequest = {
      id: "32d26e47-374b-4bcc-eddd-08dbcf02bc80",
      name: "ParkingLot1",
      hazardousLoadRate: 5,
      offer: 10,
      parkingLotLayout: "sexdfcghjb",
      totalNumberOfSlots: 6,
      taxAndFees: 10,
      location: {
        id: "f9e8aee2-0f00-4a7c-f8a0-08dbcf02bc86",
        country: "US",
        state: "Arkansas",
        latitude: 34.75526757290035,
        longitude: -92.27539582994251,
        address: "628 W Broadway St, North Little Rock, AR 72114",
        streetView: "string"
      },
      truckType: [
        {

          vehicleTypeId: "af28bf9c-803b-4406-9737-4d9e46af3076",
          numberOfSlots: 4,
          fareChargesHourly: 3.2,
          fareChargesNight: 4.2,
          fareChargesWeekly: 10,
          overStayChargesTimeSlot1: 2.5,
          overStayChargesTimeSlot2: 2.8,
          overStayChargesTimeSlot3: 3.2,

        },
        {

          vehicleTypeId: "c88c02a0-591e-4f59-87d0-31a1fdcdd8e1",
          numberOfSlots: 2,
          fareChargesHourly: 3.2,
          fareChargesNight: 4.2,
          fareChargesWeekly: 10,
          overStayChargesTimeSlot1: 2.5,
          overStayChargesTimeSlot2: 2.8,
          overStayChargesTimeSlot3: 3.2,

        }
      ],
      parkingLotFacility: [
        {

          facilityId: "d3e312f5-5657-4562-acb3-29f5e747c17d",

        },
        {

          facilityId: "9a86ba8f-f3e9-4b5d-af77-4a412271aff9",

        }

      ],
      parkingLotImages: [
        {

          imagePath: "https://th.bing.com/th?id=OIP.i8lefZ_SlO9puYT5GxrfKQHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

        },
        {

          imagePath: "https://th.bing.com/th?id=OIP.i8lefZ_SlO9puYT5GxrfKQHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

        }
      ],
      editParkingLotSlotsInput: [
        {
          vehicleTypeId: "af28bf9c-803b-4406-9737-4d9e46af3076",
          slotName: "B01"
        },
        {
          vehicleTypeId: "af28bf9c-803b-4406-9737-4d9e46af3076",
          slotName: "B02"
        }
      ],
      parkingLotMaintenanceStartDate: "2023-11-03T07:15:17.404Z",
      parkingLotMaintenanceEndDate: "2023-11-03T07:15:17.404Z",
      isEntireParkingUnderMaintenance: false,
      underMaintenanceNames: ["B01", "B02"]
    }

    const mockResponse = {

      message: "ParkingLot created successfully"

    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.editParkingLot(req).subscribe((response: any) => {
      expect(response.message).toBe(mockResponse.message);
      done(); // Call done to handle asynchronous test
    });
  });

  it('getParkingLotDetailsWithSlots successfully tested', (done: DoneFn) => {
    const req = {
      parkingLotId: "a7ee9b00-432b-4b6f-b2db-08dbd0ad2c8c"
    }
    const mockResponse = {
      data: {
        parkingLotSlotsOutput: [
          {
            vehicleTypeId: "c88c02a0-591e-4f59-87d0-31a1fdcdd8e1",
            vehicleName: "Tanker",
            slots: [
              {
                id: "d476f70e-ee97-49f0-43d2-08dbd0ad2c8f",
                slotName: "A01"
              }
            ]
          }
        ]
      }
    }

    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getParkingLotDetailsWithSlots(req.parkingLotId).subscribe((response: any) => {
      // Check for the successful response
      expect(response.data.parkingLotSlotsOutput).toBe(mockResponse.data.parkingLotSlotsOutput);
      done(); // Call done to handle asynchronous test
    });
  });


});
