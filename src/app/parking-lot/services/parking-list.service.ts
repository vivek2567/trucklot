import { Injectable } from '@angular/core';
import { APIService } from 'src/app/shared';
import { ParkingListRequest, ParkingListResponse } from '../models/parking-list.model';


@Injectable({
  providedIn: 'root'
})
export class ParkingListService {

  constructor(private apiService: APIService) { }

  getParkingLotsByManagerId(parkingListRequest: ParkingListRequest) {
    return this.apiService.post<ParkingListResponse>('ParkingLot/GetParkingLotsByManagerId', parkingListRequest);
  }
  getParkingLotsById(id: string) {
    return this.apiService.get<any>(`ParkingLot/GetParkingLotsById?id=${id}`);
  }
  getParkingLotDetailsWithSlots(parkingLotId: string) {
    return this.apiService.get<any>(`ParkingLot/GetParkingLotDetailsWithSlots?parkingLotId=${parkingLotId}`);
  }
}
