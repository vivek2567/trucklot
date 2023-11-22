import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailsComponent } from './company-details.component';
import { APIService, ApiResponse } from 'src/app/shared';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyDetailsService } from '../../services/company-details.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('CompanyDetailsComponent', () => {

  let component: CompanyDetailsComponent;
  let fixture: ComponentFixture<CompanyDetailsComponent>;
  let companyDetailsService: CompanyDetailsService;
  const mockResponseData = {
    id: 'ASDF-1233',
    companyLogoPath: 'abcc.jpg',
    companyName: 'Test company',
    mobileNumber: '2323455667',
    email: 'test@gmail.com',
    addressLine1: 'address 1',
    addressLine2: 'addressLine2',
    pincode: '23456',
    city: 'city',
    state: 'state',
    country: 'country',
    aboutCompany: 'aboutCompany',
    documents: {
      id: 'erewre',
      name: "test.pdf",
      path: 'sdasds',
      isDeleted: false
    }
  }; // Sample response data

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyDetailsComponent],
      imports: [SharedModule],
      providers: [APIService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "123" }) // Replace '123' with the desired parameter value
          }
        }]
    });
    fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
    companyDetailsService = TestBed.inject(CompanyDetailsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve company details and update the component properties', () => {

    spyOn(companyDetailsService, 'getCompanyDetails').and.returnValue(of(mockResponseData));

    component.getCompanyDetails();

    // Expectations
    expect(component.getCompanyData).toEqual(mockResponseData);
    expect(component.imageUrl).toBe(mockResponseData.companyLogoPath);
    expect(component.imgLink).toBe(mockResponseData.companyLogoPath);

  });


  it('should patch the form with data when getCompanyData is provided', () => {

    component.patchForm(mockResponseData);

    // Expectations
    const formValue = component.companyDetails.value;
    expect(formValue.companyId).toBe(mockResponseData.id);
    expect(formValue.companyLogoPath).toBe(mockResponseData.companyLogoPath);
    expect(formValue.name).toBe(mockResponseData.companyName);
    expect(formValue.mobileNumber).toBe(mockResponseData.mobileNumber);
    expect(formValue.email).toBe(mockResponseData.email);
    expect(formValue.addressLine1).toBe(mockResponseData.addressLine1);

  });

  it('should not patch the form when getCompanyData is not provided', () => {
    const getCompanyData = null; // No data provided

    component.patchForm(getCompanyData);

    // Expectations
    const formValue = component.companyDetails.value;
    expect(formValue.companyId).toBe('');
    expect(formValue.companyLogoPath).toBe('');
    expect(formValue.name).toBe('');
    expect(formValue.mobileNumber).toBe('');
    expect(formValue.email).toBe('');
    // Continue for other form fields
  });

  it('should create company details when the form is valid', () => {
    // Prepare the form data
    component.companyDetails.patchValue({
      companyId: null,
      documents: [
        {
          id: null,
          name: '',
          path: '',
          isDeleted: false
        }
      ],
      companyLogoPath: 'jskdkdsd.jpg',
      name: "test company",
      mobileNumber: "3434343434",
      email: "testUser@gmail.com",
      addressLine1: "address",
      addressLine2: "address",
      pincode: "23234",
      city: "city",
      state: "state",
      country: "country",
      aboutCompany: "compamny"
    });
    const mock: ApiResponse<any> = {
      message: "succes",
      status: true,
      data: {}
    }

    // Mock the companyService.createCompanyDetails method
    spyOn(companyDetailsService, 'createCompanyDetails').and.returnValue(of(mock));

    component.createCompanyDetails();
    // Expectations
    expect(component.showEdit).toBeTruthy()
    // Expect other assertions based on the method's behavior
  });


  it('should check edit button function', () => {

    component.btnEdit();
    // Expectations
    expect(component.showEdit).toBeFalse();
    expect(component.showCancel).toBeTruthy();
    expect(component.showUpdate).toBeTruthy();
    expect(component.disableForm).toBeFalse();
    expect(component.uploadBtn).toBeTruthy();
    expect(component.removeDocButton).toBeTruthy();
  });


  it('should update company details when the form is valid', () => {
    // Prepare the form data
    component.companyDetails.patchValue({
      companyId: "rer-2321",
      documents: [
        {
          id: "wewer-21321",
          name: 'test',
          path: 'sds.jpg',
          isDeleted: false
        }
      ],
      companyLogoPath: 'jskdkdsd.jpg',
      name: "test company",
      mobileNumber: "3434343434",
      email: "testUser@gmail.com",
      addressLine1: "address",
      addressLine2: "address",
      pincode: "23234",
      city: "city",
      state: "state",
      country: "country",
      aboutCompany: "compamny"
    });
    component.getCompanyData = [
      {
        id: "wewer-21321",
        name: 'test',
        path: 'sds.jpg',
        isDeleted: false
      }
    ];
    const mock = {
      statur: true
    }

    // Mock the companyService.createCompanyDetails method
    spyOn(companyDetailsService, 'editCompanyDetails').and.returnValue(of(mock));

    component.updateCompanyDetails(component.companyDetails);
    // Expectations
    expect(component.showUpdate).toBeFalse()
    // Expect other assertions based on the method's behavior
  });

});
