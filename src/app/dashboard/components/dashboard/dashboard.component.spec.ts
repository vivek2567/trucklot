import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { APIService } from 'src/app/shared';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardService } from '../../services/dash-board.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;
  const mockRes = [{
    name: "tes"
  }]

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [APIService],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    spyOn(dashboardService, 'getParkingLotSurveyOverall').and.returnValue(of(mockRes));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return an array of stars with the specified rating', () => {
    const rating = 4;
    const starArray = component.getStarArray(rating);

    // Expectations
    expect(starArray.length).toBe(rating); // The length of the array should be equal to the rating

    // Check if the array contains the expected values (1 for filled stars and 0 for empty stars)
    for (let i = 0; i < rating; i++) {
      expect(starArray[i]).toBe(1);
    }
  });
  it('should return an empty array for a rating of 0', () => {
    const rating = 0;
    const starArray = component.getStarArray(rating);

    // Expectations
    expect(starArray.length).toBe(0); // The array should be empty
  });

  it('should set the active property for the button with the specified chartType', () => {
    const chartType = 'WeekChart'; // Replace with your desired chartType
    const buttonStyles = [
      { label: "Day", chartType: 'DayChart', active: true },
      { label: "Weekly", chartType: 'WeekChart', active: false },
      { label: "Yearly", chartType: 'YearlyChart', active: false },
    ];

    component.buttonStyles = buttonStyles;
    component.updateButtonStyles(chartType);

    // Expectations
    expect(component.buttonStyles[0].active).toBeFalse(); // The 'bar' button should be active
    expect(component.buttonStyles[1].active).toBeTrue(); // The other buttons should not be active
    expect(component.buttonStyles[2].active).toBeFalse();
  });

  it('should retrieve parking lot states and update the response and stateCount', () => {
    const responseData = [{ state: 'State1' }, { state: 'State2' }]; // Sample response data
    spyOn(dashboardService, 'getParkingLotsStates').and.returnValue(of(responseData));

    component.getParkingLotsStates();


    // Expectations
    expect(component.response).toEqual(responseData);
    expect(component.stateCount).toBe(responseData.length);
  });

  it('should retrieve review list', () => {
    const responseData = {
      message: "success",
      status: true,
      averageRating: 12,
      data: [{
        reviewBy: "",
        rating: "",


      }]
    }
    spyOn(dashboardService, 'getReviewsByParkingLotId').and.returnValue(of(responseData));

    component.GetReviewsByParkingLotId();


    // Expectations
    expect(component.averageRating).toEqual(responseData.averageRating);
  });

  it('should retrieve truck types list by parking lot id', () => {
    component.selectedParkingLot = "werew-343243";
    const responseData = [{
      id: "ert-23-344",
      name: "tenkar",
      vehicleTypeImagePath: "",
      fareChargesHourly: 12,
      fareChargesNight: 12,
      fareChargesWeekly: 12

    }];
    spyOn(dashboardService, 'getTruckTypesByParkingLotId').and.returnValue(of(responseData));

    component.GetTruckTypesByParkingLotId();


    // Expectations
    expect(component.parkingLotDropdownList).toEqual(responseData);
    expect(component.parkingLotDropdownList.length).toEqual(responseData.length);
  });


});
