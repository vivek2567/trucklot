import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateParkingComponent } from './create-parking.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { CreateParkingService } from '../../services/create-parking.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('CreateParkingComponent', () => {
  let component: CreateParkingComponent;
  let fixture: ComponentFixture<CreateParkingComponent>;
  let activatedRoute: ActivatedRoute;
  let createParkingService: CreateParkingService;
  const parkinLotId = "234-234-fr";

  const vehicleResponse = [{ name: 'Car' }, { name: 'Truck' }]; // Sample response data

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateParkingComponent],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: parkinLotId }) // Replace '123' with the desired parameter value
          }
        }]
    });
    fixture = TestBed.createComponent(CreateParkingComponent);
    createParkingService = TestBed.inject(CreateParkingService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle error and log it', () => {
    const mockError = new HttpErrorResponse({ error: 'Some error message', status: 404 });
    spyOn(createParkingService, 'getVehicleTypeList').and.returnValue(throwError(() => mockError));


    component.bindAllMasterData();

    expect(createParkingService.getVehicleTypeList).toHaveBeenCalled();
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
    const location = {
      country: "USA",
      state: "USA",
      latitude: 123434343.434,
      longitude: 123434343.434,
      address: "USA",
      streetView: null
    }
    component.searchAutoCompleteLocation(location);
    const locAddress = component.parkingForm.get('locAddress').value;
    expect(locAddress).toBe(location.address);
  });

});
