import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { SharedModule } from '../../shared.module';
import { ProfileService } from 'src/app/manager';
import { of } from 'rxjs';
import { NotificationResponse } from '../../models/push-notification.model';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let profileService: ProfileService;
  let mockNotification: NotificationResponse = {
    unreadCount: 1,
    notifications: [
      {
        id: 'ADVF-123-AFV',
        isRead: true,
        subject: 'subject',
        message: 'message',
        userId: 'RFGTH-123-AFV',
        bookingId: 'FGTH-123-AFRGTV',
        arrivalTimeStamp: 1,
        departureTimeStamp: 1,
        notificationStatus: 1,
        arrivalTime: '',
        departureTime: '',
      }
    ]
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
    spyOn(profileService, 'getNotificationsByUserId').and.returnValue(of(mockNotification));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update userName and imagePath from profile data', () => {
    const mockProfileData = {
      name: 'John Doe',
      img: 'path-to-image.jpg',
    };

    spyOn(profileService, 'getProfileData').and.returnValue(of(mockProfileData));

    component.profileImageChange();

    expect(profileService.getProfileData).toHaveBeenCalled();
    expect(component.userName).toBe(mockProfileData.name);
    expect(component.imagePath).toBe(mockProfileData.img);
  });

  it('should get user detail', () => {
    const mockProfileData = {
      name: 'John Doe',
      profileImagePath: 'path-to-image.jpg',
    };

    spyOn(profileService, 'getUserById').and.returnValue(of(mockProfileData));

    component.ngOnInit();

    expect(profileService.getUserById).toHaveBeenCalled();
    expect(component.userName).toBe(mockProfileData.name);
    expect(component.imagePath).toBe(mockProfileData.profileImagePath);
  });
});
