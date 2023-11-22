export enum TabName {
    Past = 'Past',
    Current = 'Current',
    Upcoming = 'Upcoming'
}

export enum BookingType {
    Past = 0,
    Current = 1,
    Upcoming = 2
}
export interface BookingListRequest {
    status: BookingType;
    pageSize: number;
    pageNumber: number;
    timeZone: string;
}

export interface BookingListResponse {
    totalRecords: number;
    bookingList: Booking[]
}
export interface Booking {
    id: string;
    isHazardousLoad: boolean;
    driverName: string;
    location: string;
    bookingDate: string;
    slotName: string;
    total: number;
    createdBy: string;
    startDate: Date;
    endDate: Date;
}
