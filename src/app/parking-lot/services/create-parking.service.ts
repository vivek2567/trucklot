import { Injectable } from '@angular/core';
import { CreateParkingRequest } from '../models/create-parking-request.model';
import { EditParkingRequest } from '../models/edit-parking-request.model';
import { APIService } from 'src/app/shared';



@Injectable({
  providedIn: 'root'
})
export class CreateParkingService {
  constructor(private apiService: APIService) { }


  getVehicleTypeList() {
    return this.apiService.get<any>('VehicleType/GetVehicleTypeList');
  }

  createParkingLot(data: CreateParkingRequest) {
    return this.apiService.post('ParkingLot/CreateParkingLot', data);
  }

  getFacilityList() {
    return this.apiService.get<any>('ParkingLot/GetFacilityList')
  }
  imageUplaod(data: any = []) {
    return this.apiService.post<any>('User/ImageUpload', data);
  }
  getparkingDetailById(id: any) {
    return this.apiService.get<any>('ParkingLot/GetParkingLotsById?id=' + id);
  }
  editParkingLot(data: EditParkingRequest) {
    return this.apiService.post('ParkingLot//EditParkingLot', data);
  }
  getParkingLotDetailsWithSlots(parkingLotId: string) {
    return this.apiService.get<any>(`ParkingLot/GetParkingLotDetailsWithSlots?parkingLotId=${parkingLotId}`);
  }
}
