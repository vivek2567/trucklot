import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private isNotificationReceived: EventEmitter<boolean> = new EventEmitter<boolean>()


  isNotificationTrigger(): Observable<boolean> {
    return this.isNotificationReceived.asObservable();
  }
  setNotificationTrigger(): void {
    return this.isNotificationReceived.emit(true);
  }
}
