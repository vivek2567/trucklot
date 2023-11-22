import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParkingComponent } from './edit-parking.component';
import { DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { CreateParkingService } from '../../services/create-parking.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocationInput } from '../../models/edit-parking-request.model';

describe('EditParkingComponent', () => {
    let component: EditParkingComponent;
    let fixture: ComponentFixture<EditParkingComponent>;
    let activatedRoute: ActivatedRoute;
    let createParkingService: CreateParkingService;
    const response = [{ name: 'Car' }, { name: 'Truck' }]; // Sample response data
    // Mock the response data
    const mockResponse = {
        name: 'Sample Parking',
        location: {
            address: '123 Main St',
        },

        hazardousLoadRate: 0,
        offer: 12,
        taxAndFees: 12,
        totalNumberOfSlots: 10,
        parkingLotLayout: 'img.jpg',
        parkingLotMaintenanceStartDate: '11/10/2023 01:14',
        parkingLotMaintenanceEndDate: '11/11/2023 01:14',
        endDate: '11/10/2023 01:14',
        endTime: '11/10/2023 01:14',
        isEntireParkingUnderMaintenance: true,
        truckType: [
            {
                vehicleTypeId: '34242423-asdsad',
                fareChargesHourly: 34,
                fareChargesNight: 34
            }
        ],
        parkingLotFacility: [],
        parkingLotImages: [],


    }
    const mockFacilityResponse = [{
        id: 'TH-9875-EFT-345',
        facilityName: 'facility 1'
    }]
    const mockSlots = {
        parkingLotSlotsOutput: [],
        allowedVehicleOutput: [],
        slotsUnderMaintenance: [
            { slotName: 'sds', isMaintenance: true }
        ]
    }


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditParkingComponent],
            providers: [DatePipe,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: '123' }) // Replace '123' with the desired parameter value
                    }
                }],
            imports: [SharedModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(EditParkingComponent);
        component = fixture.componentInstance;
        createParkingService = TestBed.inject(CreateParkingService);
        activatedRoute = TestBed.inject(ActivatedRoute);
        component.selectedSlots = [];
        component.buildForm();
        fixture.detectChanges();
        component.truckTypes = [
            {
                vehicleTypeId: '34242423-asdsad',
                fareChargesHourly: 34,
                fareChargesNight: 34
            }
        ]
        spyOn(createParkingService, 'getVehicleTypeList').and.returnValue(of(response));
        spyOn(createParkingService, 'getparkingDetailById').and.returnValue(of(mockResponse));
        spyOn(createParkingService, 'getFacilityList').and.returnValue(of(mockFacilityResponse));

        spyOn(createParkingService, 'getParkingLotDetailsWithSlots').and.returnValue(of(mockSlots));


    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('should retrieve facilities list', () => {
        component.bindAllData();

        expect(createParkingService.getFacilityList).toHaveBeenCalled();
        expect(component.facilitiesList).toEqual(mockFacilityResponse);
    });

    it('should show dialog method', () => {
        const imgLink = 'tdt.jpg';

        component.showDialog(imgLink);

        expect(component.imageLinkForPreview).toBe(imgLink);
        expect(component.visible).toBeTruthy();
        expect(component.imagePreview).toBeTruthy();
    });


    it('should onDialogHide method', () => {
        component.onDialogHide();
        expect(component.visible).toBeFalsy();
    });

    it('should check searchAutoCompleteLocation method', () => {
        const defaultLocation: LocationInput =
        {
            id: "QWERF-123",
            country: "",
            state: "",
            latitude: 122,
            longitude: 122,
            address: "",
            streetView: "",
        }

        component.parkingForm.patchValue({ location: defaultLocation });

        const mockLocation = {
            country: "USA",
            state: "USA",
            latitude: 123434343.434,
            longitude: 123434343.434,
            address: "USA",
            streetView: null
        }
        component.searchAutoCompleteLocation(mockLocation);
        const locAddress = component.parkingForm.get('locAddress').value;
        expect(locAddress).toBe(mockLocation.address);
    });

});
