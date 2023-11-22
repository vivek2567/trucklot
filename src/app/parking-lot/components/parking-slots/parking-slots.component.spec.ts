import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSlotsComponent } from './parking-slots.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { CreateParkingService } from '../../services/create-parking.service';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared';

describe('ParkingSlotsComponent', () => {
    let component: ParkingSlotsComponent;
    let fixture: ComponentFixture<ParkingSlotsComponent>;
    let activatedRoute: ActivatedRoute;
    let createParkingService: CreateParkingService;
    let loaderService: LoaderService;
    const mockResponse = {
        name: 'Sample Parking',
        location: {
            address: '123 Main St',
        },

        hazardousLoadRate: 0,
        offer: 12,
        taxAndFees: 12,
        totalNumberOfSlots: 25,
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
        truckTypeArray: [{
            truckType: '1234',
            numberOfSlots: 12
        }]
    }
    const truckType = [
        {
            id: "1234",
            truckName: "ted",
            totalSlots: 3
        }
    ]


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ParkingSlotsComponent],
            imports: [SharedModule],
            providers: [{
                provide: ActivatedRoute,
                useValue: {
                    params: of({ id: '123' }) // Replace '123' with the desired parameter value
                }
            }]
        });
        fixture = TestBed.createComponent(ParkingSlotsComponent);
        component = fixture.componentInstance;
        localStorage.setItem('parkingFirstPage', JSON.stringify(mockResponse));
        localStorage.setItem('truckData', JSON.stringify([truckType]));
        localStorage.setItem('selectedSlotsMian', JSON.stringify([]));

        createParkingService = TestBed.inject(CreateParkingService);
        activatedRoute = TestBed.inject(ActivatedRoute);
        loaderService = TestBed.inject(LoaderService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should createParking successfully when form is valid', () => {
        component.parkingSlotForm.patchValue({
            totalSlots: "10",
            truckTypeArray: []
        });

        spyOn(createParkingService, 'createParkingLot').and.returnValue(of());


        // Call the createParking method
        component.createParking();

        // Expectations

        expect(component.parkingSlotForm.valid).toBeFalsy();
    });
});
