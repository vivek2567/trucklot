import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewParkingComponent } from './view-parking.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { APIService, LoaderService } from 'src/app/shared';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ParkingListService } from '../../services/parking-list.service';

describe('ViewParkingComponent', () => {
    let component: ViewParkingComponent;
    let fixture: ComponentFixture<ViewParkingComponent>;
    let parkingListService: ParkingListService;
    let activatedRoute: ActivatedRoute;
    let loaderService: LoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewParkingComponent],
            providers: [APIService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: '123' }) // Replace '123' with the desired parameter value
                    }
                }],
            imports: [SharedModule]
        });
        fixture = TestBed.createComponent(ViewParkingComponent);
        component = fixture.componentInstance;
        activatedRoute = TestBed.inject(ActivatedRoute);
        parkingListService = TestBed.inject(ParkingListService);
        loaderService = TestBed.inject(LoaderService)
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch parking lots and update properties on success', () => {
        const mockResponse = {
            name: "test parking",
            location: { address: "USA" },
            hazardousLoadRate: 12,
            offer: 12,
            truckType: [],
            parkingLotImage: "test.jpg"

        }
        spyOn(parkingListService, 'getParkingLotsById').and.returnValue(of(mockResponse));

        component.getParkingDataById();
        expect(parkingListService.getParkingLotsById).toHaveBeenCalled();
        expect(component.name).toEqual(mockResponse.name);
    });


    it('should handle error and hide loader', () => {
        const mockError = new Error('Some error message');
        spyOn(parkingListService, 'getParkingLotsById').and.returnValue(throwError(() => mockError));
        spyOn(loaderService, 'hideLoader');

        component.id = '123'; // Set the id to an appropriate value

        component.getParkingDataById();

        expect(loaderService.hideLoader).toHaveBeenCalled();
        // Handle error-specific expectations here
    });
});