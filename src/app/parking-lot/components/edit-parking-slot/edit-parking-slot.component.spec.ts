import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParkingSlotComponent } from './edit-parking-slot.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateParkingService } from '../../services/create-parking.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('EditParkingSlotComponent', () => {
  let component: EditParkingSlotComponent;
  let fixture: ComponentFixture<EditParkingSlotComponent>;
  let activatedRoute: ActivatedRoute;
  let createParkingService: CreateParkingService;
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
  const parkinLotId = "234-234-fr"
  const mockSlots = {
    parkingLotSlotsOutput: [],
    allowedVehicleOutput: [],
    slotsUnderMaintenance: [
      { slotName: 'sds', isMaintenance: true }
    ]
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditParkingSlotComponent],
      imports: [SharedModule],
      providers: [DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: parkinLotId }) // Replace '123' with the desired parameter value
          }
        }]
    });
    fixture = TestBed.createComponent(EditParkingSlotComponent);
    component = fixture.componentInstance;
    localStorage.setItem('parkingFirstPage', JSON.stringify(mockResponse));
    localStorage.setItem('truckData', JSON.stringify([]));
    localStorage.setItem('selectedSlotsMian', JSON.stringify([]));
    createParkingService = TestBed.inject(CreateParkingService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
    spyOn(createParkingService, 'getParkingLotDetailsWithSlots').and.returnValue(of(mockSlots));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set parkingLotSlotsOutput and call bindData on success', () => {
    spyOn(component, 'bindData');

    component.parkingLotId = parkinLotId; // Set the parkingLotId to an appropriate value

    component.getParkingLotDetailsWithSlots();

    expect(component.parkingLotSlotsOutput).toEqual(mockSlots.parkingLotSlotsOutput);
  });

  
});
