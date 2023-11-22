import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { APIService } from 'src/app/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { GetNotificationRequest, NotificationResponse, UpdateNotificationRequest } from 'src/app/shared/models/push-notification.model';

describe('ProfileService', () => {
  let service: ProfileService; let apiService: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(ProfileService);
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getUserById successfully', (done: DoneFn) => {
    const req = {
      id: "f0cf26ca-c83b-402f-61ee-08dbba99d5d7"
    };

    const mockResponse = {
      message: "User detail fetched successfully",
      status: true,
      data: {
        id: "f0cf26ca-c83b-402f-61ee-08dbba99d5d7",
        email: "user1@gmail.com",
        name: "John Smith",
        profileImagePath: "test.jpg",
        mobileNumber: "1234567890"
      }
    }
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));
    service.getUserById(req.id).subscribe((response: any) => {
      // Check for the successful response
      expect(response.data).toBe(mockResponse.data);
      expect(response.status).toBeTruthy();

      done();
    });

  });

  it('should editManagerDetail successfully', (done: DoneFn) => {
    const req = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "string",
      mobileNumber: "string",
      profileImagePath: "string"
    };

    const mockResponse = {
      message: "",
      status: true,
      data: {
        name: "David",
        profileImagePath: "test.jpg",
      }
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.editManagerDetail(req).subscribe((response: any) => {
      // Check for the successful response
      expect(response.id).toBe(response.mockResponse);

      done();
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

  it('should emit the profileData event', () => {
    spyOn(service.profileData, 'emit'); // Spy on the emit method of the profileData event

    const mockProfileData = {
      name: 'John Doe',
      img: 'path-to-image.jpg',
    };

    service.setProfileData(mockProfileData);

    expect(service.profileData.emit).toHaveBeenCalledWith(mockProfileData);
  });

  it('should return profile data as an Observable', (done: DoneFn) => {
    const mockProfileData = {
      name: 'John Doe',
      img: 'path-to-image.jpg',
    };
    service.getProfileData().subscribe((data) => {
      expect(data).toEqual(mockProfileData);
      done();
    });
    service.setProfileData(mockProfileData);
  });

  it('getNotificationsByUserId services success', (done: DoneFn) => {
    const notificationsByUserRequest: GetNotificationRequest = {
      pageNumber: 0,
      pageSize: 0,
      isWebPortal: true,
      timeZone: "IST"
    };

    const mockResponse: NotificationResponse = {
      unreadCount: 2,
      notifications: []
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.getNotificationsByUserId(notificationsByUserRequest).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      done();
    });

  });


  it('getNotificationsByUserId services ', (done: DoneFn) => {
    const updateNotificationRequest: UpdateNotificationRequest = {
      notificationId: 'ASCFB-ASWF'
    };

    const mockResponse: any = {
      status: true
    }
    spyOn(apiService, 'post').and.returnValue(of(mockResponse));
    service.updateNotificationReadStatus(updateNotificationRequest).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      done();
    });

  });

});
