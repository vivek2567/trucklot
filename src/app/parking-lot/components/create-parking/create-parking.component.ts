import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateParkingService } from '../../services/create-parking.service';
import { MapsComponent } from '../maps/maps.component';
import { catchError, combineLatest, finalize, of } from 'rxjs';
import { LoaderService, Utility } from 'src/app/shared';

@Component({
  selector: 'app-create-parking',
  templateUrl: './create-parking.component.html',
  styleUrls: ['./create-parking.component.scss']
})
export class CreateParkingComponent implements OnInit {

  truckTypes: any[] = [];
  parkingLotFacility: any[] = [];
  selectedOptions: any[] = [];
  noOptionsAvailable: boolean = false;
  fieldsToAdd: string[] = ['hourly', 'nightly', 'weekly']; // Example, add other fields as needed
  count: number = 1
  buttonDisabled: boolean = true;
  dynamicFormValues: any[] = []
  facilities: any[] = [];
  facilityName: any[] = [];
  facilitiesList: any[] = [];
  facilityId: { [key: string]: string } = {};
  selectedTruckType: any;
  parkingForm!: FormGroup;
  fieldName: string = '';
  items: { value: string }[] = [{ value: '' }];
  isImgError1: boolean = false
  isImgError2: boolean = false
  isImgError3: boolean = false
  images: any[] = [];
  imageUrl2: string = '';
  imageUrl3: string = '';
  imageUrl1: string = '';
  btn1: boolean = false;
  btn2: boolean = false;
  btn3: boolean = false;
  totalTruckCategory = 0;
  imagePreview: boolean = false
  imageLinkForPreview: string
  visible: boolean = false


  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private dialogService: DialogService,
    private parkingService: CreateParkingService,
    private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.loaderService.hideLoader()
    this.buildForm();
    this.bindAllMasterData();

  }
  bindAllMasterData(): void {
    this.loaderService.showLoader();
    combineLatest([
      this.parkingService.getVehicleTypeList()
        .pipe(
          catchError(() => {
            return of(null)
          }),
        ),
      this.parkingService.getFacilityList()
        .pipe(
          catchError(() => {
            return of(null)
          }),
        )
    ])
      .pipe(
        finalize(() => { this.loaderService.hideLoader() })
      )
      .subscribe({
        next: ([_vehicleData, _facilityData]) => {
          if (_vehicleData) { this.truckTypes = _vehicleData; }

          if (_facilityData) { this.facilitiesList = _facilityData; }

        }
      })

  }
  buildForm(): void {
    this.parkingForm = this.fb.group({
      name: ['', [Validators.required]],
      hazardousLoadRate: [, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      location: [''],
      offer: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      taxAndFees: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      truckTypeArray: this.fb.array([]),
      parkingLotFacility: this.fb.array([]),
      parkingPhotos: [''],
      locAddress: ['', Validators.required]
    });
    this.addNewTruckType();
    this.parkingForm.get("locAddress").valueChanges.subscribe((location: string) => {
      if (!location) {
        this.parkingForm.patchValue({ location: '' });
      }
    })
  }
  newTruckType(): FormGroup {
    return this.fb.group({
      truckType: ['', [Validators.required]],
      hourly: [, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$'),]],
      nightly: [, [Validators.required, Validators.pattern('^([0-9])+(\.[0-9]+)?$')]],
      weekly: [, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      slot1: [, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      slot2: [, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      slot3: [, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]]
    })
  }
  get truckTypeArray(): FormArray {
    return this.parkingForm.get("truckTypeArray") as FormArray
  }
  isFieldInvalid(fieldName: string) {
    const control = this.parkingForm.get(fieldName);
    return control?.invalid && (control?.touched || control?.dirty);
  }
  addNewTruckType(): void {
    this.totalTruckCategory += 1;
    this.truckTypeArray.push(this.newTruckType());
  }

  selectTruckType() {
    let selectedTruckData: [] = (this.parkingForm.get("truckTypeArray") as FormArray).value
    if (selectedTruckData.length > 0) {
      this.truckTypes.map((truck: any) => {
        let selectedIndex = selectedTruckData.findIndex((option: any) => option.truckType === truck.id)
        if (selectedIndex !== -1) {
          truck.disabled = true;
        }
        else {
          truck.disabled = false;
        }
      })
    }
    else {
      this.truckTypes.map((truck: any) => {
        truck.disabled = false;
      })
    }
    this.noOptionsAvailable = this.truckTypes.length === 0;
    this.buttonDisabled = false
  }
  addFacilityId(id: string) {
    const index = this.parkingLotFacility.indexOf(id);

    if (index !== -1) {
      // ID is in the array, so remove it
      this.parkingLotFacility.splice(index, 1);
    } else {
      // ID is not in the array, so add it
      this.parkingLotFacility.push(id);
    }

  }
  nextPage(data: FormGroup): void {
    if (this.parkingForm.valid) {
      let parkingLotFacilityArray = data.get("parkingLotFacility") as FormArray;

      this.parkingLotFacility.forEach((fac) => {
        parkingLotFacilityArray.value.push(fac);
      })
      let truckTypeArray = this.truckTypeArray.value;
      let truckData: any[] = [];
      truckTypeArray.forEach((truck: any) => {
        const selectedTruck = this.truckTypes.find((x: any) => x.id == truck.truckType);
        truckData.push(selectedTruck);
      })

      data.get("parkingPhotos")?.patchValue(this.images);
      localStorage.setItem('truckData', JSON.stringify(truckData));
      localStorage.setItem('parkingFirstPage', JSON.stringify(data.value));
      this.parkingSlots();
    }
    else {
      Utility.markFormGroupTouched(this.parkingForm);
    }

  }
  openMap() {
    const ref = this.dialogService.open(MapsComponent, {
      width: '70%',
      height: '100%',
      data: this.parkingForm.get('location')?.value
    });
    ref.onClose.subscribe((response: any) => {
      this.patchLocation(response);
    });
  }

  parkingSlots() {
    this.router.navigateByUrl('manager/parking/slots');
  }
  uploadImage1(files: any) {
    const formData = new FormData()
    const file = files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.isImgError1 = true;
      return
    }
    this.isImgError1 = false;
    formData.append('Images', file, file.name);
    this.loaderService.showLoader();
    this.parkingService.imageUplaod(formData)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        response => {
          const data = response;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const name = key; // The property name is the document name
              const url = data[key];
              this.imageUrl1 = url
              this.images.push(url)
              this.btn1 = true
            }
          }
        })
  }
  uploadImage2(event: any) {
    const formData = new FormData()
    const file = event.files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.isImgError2 = true;
      return
    }
    this.isImgError2 = false;
    formData.append('Images', file, file.name);
    this.loaderService.showLoader();
    this.parkingService.imageUplaod(formData)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        response => {
          const data = response;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const name = key; // The property name is the document name
              const url = data[key];
              this.imageUrl2 = url
              this.images.push(url)
              this.btn2 = true
            }
          }
        })
  }
  uploadImage3(event: any) {
    const formData = new FormData()
    const file = event.files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.isImgError3 = true;
      return
    }
    this.isImgError3 = false;
    formData.append('Images', file, file.name);
    this.loaderService.showLoader();
    this.parkingService.imageUplaod(formData)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        response => {
          const data = response;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const name = key; // The property name is the document name
              const url = data[key];
              this.imageUrl3 = url

              this.images.push(url)
              this.btn3 = true

            }
          }
        })
  }

  fileSizeValidator(maxSize: number) {
    return (control: AbstractControl) => {
      if (control.value) {
        const file = control.value as File; // Cast control.value to File
        if (file.size > maxSize * 1024 * 1024) { // Convert maxSize to bytes
          return {
            fileSizeExceedsLimit: true
          };
        }
      }
      return null;
    };
  }
  del1(event: string) {

    // Find the index of the URL in the array
    const index = this.images.indexOf(event);

    // Check if the URL is in the array
    if (index !== -1) {
      // Remove the URL from the array
      this.images.splice(index, 1);
      this.imageUrl1 = ''
      this.btn1 = false
    }


    // Verify that the URL has been removed
  }
  del2(event: string) {
    // Find the index of the URL in the array
    const index = this.images.indexOf(event);

    // Check if the URL is in the array
    if (index !== -1) {
      // Remove the URL from the array
      this.images.splice(index, 1);
      this.imageUrl2 = ''
      this.btn2 = false
    }

    // Verify that the URL has been removed
  }
  del3(event: string) {

    // Find the index of the URL in the array
    const index = this.images.indexOf(event);

    // Check if the URL is in the array
    if (index !== -1) {
      // Remove the URL from the array
      this.images.splice(index, 1);
      this.imageUrl3 = ''
      this.btn3 = false
    }

    // Verify that the URL has been removed
  }
  showDialog(imageLink: string): void {
    this.imagePreview = true
    this.imageLinkForPreview = imageLink
    this.visible = true
  }
  onDialogHide(): void {
    this.visible = false;
  }
  searchAutoCompleteLocation(_location: any) {
    this.patchLocation(_location);
  }
  patchLocation(location: any): void {
    if (location) {
      this.parkingForm.patchValue({
        locAddress: location.address,
        location: location
      });
    }
  }

}


