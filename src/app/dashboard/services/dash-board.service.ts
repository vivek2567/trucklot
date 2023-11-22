import { Injectable } from '@angular/core';
import { APIService, Utility } from 'src/app/shared';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: APIService) { }


  getParkingLotByStatesName(stateName: String) {
    return this.apiService.get<any>(`Dashboard/GetParkingLotByStatesName?state=${stateName}`);
  }
  getParkingLotsStates() {
    return this.apiService.get<any>(`Dashboard/GetParkingLotStatesByManagerId`);
  }
  getReviewsByParkingLotId(state: String) {
    return this.apiService.getWithAllResponse<any>(`Dashboard/GetReviewsByParkingLotId?state=${state}`);
  }
  getAllBookingEarningDetails(state: String) {
    const timeZone = Utility.getLocalTimeZone();
    return this.apiService.get<any>(`Dashboard/GetAllBookingEarningDetails?state=${state}&timeZone=${timeZone}`);
  }
  getTruckTypesByParkingLotId(id: string) {
    return this.apiService.get<any>(`Dashboard/GetTruckTypesByParkingLotId?id=${id}`);
  }
  getParkingLotSurveyOverall(status: any, id: any, state: String) {
    return this.apiService.get<any>(`Dashboard/GetParkingLotSurveyOverall?surveyRange=${status}&parkingLotId=${id}&state=${state}`);
  }
  getParkingLotSurveyOverallRecord(status: any, state: String) {
    return this.apiService.get<any>(`Dashboard/GetParkingLotSurveyOverall?surveyRange=${status}&state=${state}`);
  }
}

