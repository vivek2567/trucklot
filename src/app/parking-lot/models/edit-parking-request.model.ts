export interface EditParkingRequest {
    id: string;
    name: string;
    hazardousLoadRate: number;
    offer: number;
    parkingLotLayout: string | null;
    totalNumberOfSlots: number;
    taxAndFees: number;
    location: LocationInput;
    truckType: TruckTypeInput[];
    parkingLotFacility: ParkingLotFacilityInput[];
    parkingLotImages: ParkingLotImagesInput[];
    editParkingLotSlotsInput: ParkingLotSlotsInput[];
    parkingLotMaintenanceStartDate: string,
    parkingLotMaintenanceEndDate: string,
    isEntireParkingUnderMaintenance: boolean,
    underMaintenanceNames: string[]
}
export interface LocationInput {
    id: string;
    country: string;
    state: string;
    latitude: number;
    longitude: number;
    address: string;
    streetView: string | null;
}
export interface TruckTypeInput {
    vehicleTypeId: string;
    numberOfSlots: number;
    fareChargesHourly: number;
    fareChargesNight: number;
    fareChargesWeekly: number;
    overStayChargesTimeSlot1: number;
    overStayChargesTimeSlot2: number;
    overStayChargesTimeSlot3: number;
}
export interface ParkingLotFacilityInput {
    facilityId: string;
}

export interface ParkingLotImagesInput {
    imagePath: string;
}
export interface ParkingLotSlotsInput {
    vehicleTypeId: string;
    slotName: string;
}
