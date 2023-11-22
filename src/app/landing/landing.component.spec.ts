import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { APIService, LoaderService } from '../shared';
import { LandingService } from '../shared/services/landing.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ApiResponse, EmptyApiResponse } from '../shared/models/api-response.model';
import { EnquiryRequest } from '../shared/models/enquiry.model';
import { of } from 'rxjs';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let loaderService: LoaderService;
  let landingService: LandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [SharedModule],
      providers: [LandingService, APIService, HttpClient, HttpHandler, MessageService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
    landingService = TestBed.inject(LandingService);
    spyOn(loaderService, 'showLoader');
    spyOn(loaderService, 'hideLoader');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create an enquiry when the form is valid', () => {
    const mockEnquiryRequest: EnquiryRequest = {
      name: "Test",
      businessName: "Test",
      email: "test@gmail.com",
      phoneNumber: "",
      message: "",
    };
    component.landingForm.patchValue({
      name: "Test",
      businessName: "Test",
      email: "test@gmail.com",
      phoneNumber: "",
      message: "",
    });
    const mockResponse: ApiResponse<EmptyApiResponse> = {
      status: true,
      message: 'Enquiry created successfully',
      data: {
        status: true,
        message: 'Enquiry created successfully',
      }
    };
    spyOn(landingService, 'createEnquiry').and.returnValue(of(mockResponse));

    component.createEnquiry();

    expect(landingService.createEnquiry).toHaveBeenCalledWith(mockEnquiryRequest);
  });

  it('should mark form as touched when the form is invalid', () => {
    component.createEnquiry();
    expect(loaderService.showLoader).not.toHaveBeenCalled();
  });

});
