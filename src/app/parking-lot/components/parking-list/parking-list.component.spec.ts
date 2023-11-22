import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingListComponent } from './parking-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParkingListService } from '../../services/parking-list.service';
import { LoaderService } from 'src/app/shared';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ParkingListResponse } from '../../models/parking-list.model';

describe('ParkingListComponent', () => {
  let component: ParkingListComponent;
  let fixture: ComponentFixture<ParkingListComponent>;
  let listService: ParkingListService;
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParkingListComponent],
      imports: [SharedModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: "123" }) // Replace '123' with the desired parameter value
        }
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ParkingListComponent);
    component = fixture.componentInstance;
    listService = TestBed.inject(ParkingListService);
    loaderService = TestBed.inject(LoaderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch parking lots and update properties on success', () => {
    const mockResponse: ParkingListResponse = {
      totalRecords: 1,
      parkingList:
        [
          {
            id: "test-drg-",
            name: "test",
            parkingLocation: "USA",
            numberOfSlots: 10,
            vehicleAllowed: []
          }
        ]
    };
    spyOn(listService, 'getParkingLotsByManagerId').and.returnValue(of(mockResponse));
    spyOn(loaderService, 'showLoader');
    spyOn(loaderService, 'hideLoader');

    component.getParkingLotsByManagerId();

    expect(loaderService.showLoader).toHaveBeenCalled();
    expect(listService.getParkingLotsByManagerId).toHaveBeenCalled();
    expect(component.parkingList).toEqual(mockResponse.parkingList);
    expect(component.totalItems).toBe(mockResponse.parkingList.length);
    expect(component.itemsPerPage).toBe(10);
    // Ensure any other relevant expectations here
    expect(loaderService.hideLoader).toHaveBeenCalled();
  });

  it('should handle error and hide loader', () => {
    const mockError = new Error('Some error message');
    spyOn(listService, 'getParkingLotsByManagerId').and.returnValue(throwError(() => mockError));
    spyOn(loaderService, 'hideLoader');

    component.getParkingLotsByManagerId();

    expect(loaderService.hideLoader).toHaveBeenCalled();
    // Handle error-specific expectations here
  });
});
