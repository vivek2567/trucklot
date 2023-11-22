export interface ParkingListRequest {
    search: string;
    pageNumber: number;
    pageSize: number;
}
export interface ParkingListResponse {
    totalRecords: number;
    parkingList: Parking[]
}
export interface Parking {
    id: string;
    name: string;
    parkingLocation: string;
    numberOfSlots: number;
    vehicleAllowed: Vehicle[]
}
export interface Vehicle {
    id: string;
    name: string;
    parkingLotId: string;
    vehicleTypeImagePath: string;
}