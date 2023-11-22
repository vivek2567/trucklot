import { Component, OnInit } from '@angular/core';
import { DEFAULT_PP, DEFAULT_USERNAME } from '../../constant/shared.constant';
import { LayoutService } from '../../services/layout.service';
import { ProfileService } from 'src/app/manager';
import { AuthService } from 'src/app/core';
import { EventEmitter } from '@angular/core';

import * as signalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { SignalRService } from '../../services/signal-r.service';
import { environment } from 'src/environment/environment';
import { BookingService, ViewBookingComponent } from 'src/app/booking';
import { DialogService } from 'primeng/dynamicdialog';
import { GetNotificationRequest, NotificationResponse, PushNotification, UpdateNotificationRequest } from '../../models/push-notification.model';
import { Utility } from '../../services/utility.abstract';

const baseURL = environment.notificationEndPoint;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  imagePath = DEFAULT_PP;
  userName = DEFAULT_USERNAME;
  bookingId: string;
  notificationRecord: PushNotification[] = [];
  noticationData: EventEmitter<string> = new EventEmitter<string>()

  private _hubConnection: HubConnection | undefined;

  showNotifications: boolean = false
  constructor(
    private service: ProfileService,
    private authService: AuthService,
    private signalRService: SignalRService,
    private dialogService: DialogService,
    private layoutService: LayoutService,
    private bookingService: BookingService) { }

  ngOnInit(): void {
    this.profileImageChange();
    this.service.getUserById(this.authService.getUserId()).subscribe(response => {
      if (response.profileImagePath) {
        this.imagePath = response.profileImagePath;
      }
      if (response.name) {

        this.userName = response.name;
      }
    });
    this.startHubConnection();
    this.getNotificationsByUserId();
  }
  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }
  getNotificationsByUserId() {

    const getNoficationReq: GetNotificationRequest = {
      pageNumber: 1,
      pageSize: 10,
      isWebPortal: true,
      timeZone: Utility.getLocalTimeZone()
    }

    this.service.getNotificationsByUserId(getNoficationReq)
      .subscribe({
        next: (res: NotificationResponse) => {
          this.notificationRecord = res.notifications;
        },
        error: () => {
          this.notificationRecord = [];
        }
      })
  }
  handleNotificationClick(notification: PushNotification) {
    this.bookingService.getid(notification.bookingId);
    this.updateNotificationReadStatus(notification.id);

    const ref = this.dialogService.open(ViewBookingComponent, {
      width: '45%',
      height: '100%',
    });

  }
  updateNotificationReadStatus(_id: any) {
    const updateNotificationRequest: UpdateNotificationRequest = { notificationId: _id };
    this.service.updateNotificationReadStatus(updateNotificationRequest)
      .subscribe({
        next: () => {
          this.getNotificationsByUserId();
        }
      });
  }

  profileImageChange(): void {
    this.service.getProfileData()
      .subscribe(
        (profileData: { name: string, img: string }) => {
          if (profileData.name) {
            this.userName = profileData.name;
          }
          if (profileData.img) {
            this.imagePath = profileData.img;
          }

        })
  }
  showHideNotificationList(): void {
    this.showNotifications = !this.showNotifications
  }

  private startHubConnection() {
    const options = {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    };

    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(baseURL, options)
      .withAutomaticReconnect()
      .build();

    this._hubConnection!
      .start()
      .then(() => {
      })
      .catch(() => {

      });

    this._hubConnection!.on('BroadcastMessage', (userId: string, _type: string, _payload: string) => {
      if (userId == this.authService.getUserId()) {
        this.signalRService.setNotificationTrigger();
        this.getNotificationsByUserId();
      }
    });
  }
}
