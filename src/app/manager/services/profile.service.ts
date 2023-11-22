import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/shared';
import { GetNotificationRequest, NotificationResponse, UpdateNotificationRequest } from 'src/app/shared/models/push-notification.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileData: EventEmitter<{ name: string, img: string }> = new EventEmitter<{ name: string, img: string }>()

  constructor(private apiService: APIService) { }


  getUserById(id: string) {
    return this.apiService.get<any>(`User/GetUserDetailById?id=${id}`);
  }

  editManagerDetail(data: any) {
    return this.apiService.post('User/UpdateManagerDetailById', data);
  }
  imageUplaod(data: any = []) {
    return this.apiService.post<any>('User/ImageUpload', data);
  }
  setProfileData(profileData: { name: string, img: string }): void {
    this.profileData.emit(profileData);

  }
  getProfileData(): Observable<{ name: string, img: string }> {
    return this.profileData.asObservable();
  }
  getNotificationsByUserId(request: GetNotificationRequest) {
    return this.apiService.post<NotificationResponse>('Notification/GetNotificationsByUserId', request);
  }
  updateNotificationReadStatus(resuest: UpdateNotificationRequest) {
    return this.apiService.post<any>('Notification/UpdateNotificationReadStatus', resuest);
  }
}
