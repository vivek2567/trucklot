import { TestBed } from '@angular/core/testing';

import { CompanyDetailsService } from './company-details.service';
import { APIService, ApiResponse } from 'src/app/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';

describe('CompanyDetailsService', () => {
  let service: CompanyDetailsService;
  let apiService: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(CompanyDetailsService);
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getCompanyDetails successfully', (done: DoneFn) => {


    const mockResponse = {
      message: "Company detail fetched successfully",
      status: true,
      data: {
        id: "be521a91-b5f7-4585-c115-08dbd0ac75e5",
        companyName: "Atomic Truck Parking Demo",
        companyLogoPath: "test.jpg",
        email: "user1@gmail.com",
        addressLine1: "5301 S Second Ave",
        addressLine2: "",
      }
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getCompanyDetails().subscribe((response: any) => {
      // Check for the successful response
      expect(response.data).toBe(mockResponse.data);
      expect(response.status).toBeTruthy();
      done(); // Call done to handle asynchronous test
    });

  });

  it('should createCompanyDetails successfully', (done: DoneFn) => {
    const req = {
      name: "string",
      companyLogoPath: "string",
      mobileNumber: "string",
      email: "string",
      addressLine1: "string",
      addressLine2: "string",
      pincode: "string",
      city: "string",
      state: "string",
      country: "string",
      documents: [
        {
          name: "string",
          path: "string"
        }
      ],
      aboutCompany: "string"
    }

    const mockResponse: ApiResponse<any> = {
      message: "",
      status: true,
      data: {
        id: 'ASDF-1233',
        companyLogoPath: "abcc.jpg",
        companyName: "Test company",
        mobileNumber: "2323455667",
        email: "test@gmail.com",
        addressLine1: "address 1",
        addressLine2: "addressLine2",
        pincode: "23456",
        city: "city",
        state: "state",
        country: "country",
        aboutCompany: "aboutCompany",
        documents: {
          id: "erewre",
          name: "test.pdf",
          path: "sdasds",
          isDeleted: false
        }
      }
    }
    spyOn(apiService, 'postWithAllResponse').and.returnValue(of(mockResponse));
    service.createCompanyDetails(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe(response.mockResponse);
      done(); // Call done to handle asynchronous test
    });

  });

  it('should editCompanyDetails successfully', (done: DoneFn) => {
    const req = {
      companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "string",
      companyLogoPath: "string",
      mobileNumber: "string",
      email: "string",
      addressLine1: "string",
      addressLine2: "string",
      pincode: "string",
      city: "string",
      state: "string",
      country: "string",
      documents: [
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          path: "string",
          isDeleted: true
        }
      ],
      aboutCompany: "string"
    }

    const mockResponse = {
      message: "",
      status: true,
      data: {
        companyId: null,
        documents: [
          {
            id: null,
            name: '',
            path: '',
            isDeleted: false
          }
        ],
        companyLogoPath: "jskdkdsd.jpg",
        name: "test company",
        mobileNumber: "3434343434",
        email: "testuser@gmail.com",
        addressLine1: "address",
        addressLine2: "address",
        pincode: "23234",
        city: "city",
        state: "state",
        country: "country",
        aboutCompany: "compamny"
      }
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.editCompanyDetails(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe(response.mockResponse);
      done(); // Call done to handle asynchronous test
    });

  });
  it('should upload image successfully', (done: DoneFn) => {
    const req = [
      { filename: "test.jpg" }
    ]

    const mockResponse = {
      url: "test.jpg"
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.imageUplaod(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.url).toBe(mockResponse.url);

      done();
    });

  });


});
