import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileService } from '../../services/profile.service';
import { LoaderService } from 'src/app/shared';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileService: ProfileService;
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "123" }) // Replace '123' with the desired parameter value
          }
        }
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
    loaderService = TestBed.inject(LoaderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch the form with user data and hide the loader', () => {
    const userData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      profileImagePath: 'path-to-image.jpg'
    };

    component.userForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      mobileNumber: new FormControl(''),
      profileImagePath: new FormControl('')
    });

    spyOn(loaderService, 'hideLoader').and.stub(); // Spy on hideLoader and stub it

    component.patchForm(userData);

    // Expect the form controls to be patched with user data
    expect(component.userForm.get('id').value).toBe(userData.id);
    expect(component.userForm.get('name').value).toBe(userData.name);
    expect(component.userForm.get('email').value).toBe(userData.email);
    expect(component.userForm.get('mobileNumber').value).toBe(userData.mobileNumber);
    expect(component.userForm.get('profileImagePath').value).toBe(userData.profileImagePath);

    // Expect the hideLoader method to have been called
    expect(loaderService.hideLoader).toHaveBeenCalled();
  });

  it('should fetch user data and patch the form', () => {
    const userData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      profileImagePath: 'path-to-image.jpg'
    };

    // Create a spy for the profileService.getUserById method
    const getUserByIdSpy = spyOn(profileService, 'getUserById').and.returnValue(of(userData));

    // Initialize the component's userData
    component.userData = null; // You can set it to null before calling getUserdeatil

    component.getUserdeatil();

    // Expect the getUserById method to have been called with the correct ID (this.id)
    expect(getUserByIdSpy).toHaveBeenCalledWith(component.id);

    // Expect the userData to have been set
    expect(component.userData).toEqual(userData);

  });

  it('should set flags and properties correctly for editing', () => {
    // Ensure that the initial state is set correctly
    component.showEdit = true;
    component.showCancel = false;
    component.showUpdate = false;
    component.disableForm = true;
    component.uploadBtn = false;

    // Call the btnEdit function
    component.btnEdit();

    // Expect the state to be updated as expected
    expect(component.showEdit).toBe(false);
    expect(component.showCancel).toBe(true);
    expect(component.showUpdate).toBe(true);
    expect(component.disableForm).toBe(false);
    expect(component.uploadBtn).toBe(true);
  });

  it('should reset the form when "showSave" is true', () => {
    component.showSave = true;
    component.showCancel = true;
    component.userForm = new FormGroup({
      id: new FormControl('test'),
      name: new FormControl('test'),
      email: new FormControl(''),
      mobileNumber: new FormControl(''),
      profileImagePath: new FormControl('')
    });

    component.onCancel();

    // Expect the userForm to be reset when showSave is true
    expect(component.userForm.get("id").value).toEqual(null); // Check if the form is empty
  });
  it('should submit the form and handle success', () => {
    const userData = {
      id: "1234-AVE",
      name: 'John Doe',
      profileImagePath: 'path-to-image.jpg',
      // Add other user data properties as needed
    };

    // Mock a successful response from the editManagerDetail service method
    spyOn(profileService, 'editManagerDetail').and.returnValue(of(userData));

    // Mock the showSuccessToast method
    const showSuccessToastSpy = spyOn(component, 'showSuccessToast');

    // Mock the setProfileData method
    const setProfileDataSpy = spyOn(profileService, 'setProfileData');

    // Mock the getUserdeatil method
    const getUserdeatilSpy = spyOn(component, 'getUserdeatil');

    // Set the form data for the test
    component.userForm.setValue({
      id: "1234-AVE",
      name: 'New Name',
      mobileNumber: '1234567890',
      email: "user@gmail.com",
      profileImagePath: "test.jpg"
      // Set other form values as needed
    });

    component.submit(component.userForm);

    // Expect the form controls to be marked as touched
    expect(component.userForm.get('name').touched).toBe(true);
    expect(component.userForm.get('mobileNumber').touched).toBe(true);
    // Expect the showSuccessToast method to have been called
    expect(showSuccessToastSpy).toHaveBeenCalledWith('Updated Succesfully');

    // Expect the editManagerDetail method to have been called with the form data
    expect(profileService.editManagerDetail).toHaveBeenCalledWith(component.userForm.value);

    // Expect the setProfileData method to have been called with the response data
    expect(setProfileDataSpy).toHaveBeenCalledWith({ name: userData.name, img: userData.profileImagePath });

    // Expect the getUserdeatil method to have been called
    expect(getUserdeatilSpy).toHaveBeenCalled();

    // Expect the component properties to be updated as expected
    expect(component.showEdit).toBe(true);
    expect(component.showUpdate).toBe(false);
    expect(component.disableForm).toBe(true);
    expect(component.showCancel).toBe(false);
    expect(component.uploadBtn).toBe(false);
  });

});