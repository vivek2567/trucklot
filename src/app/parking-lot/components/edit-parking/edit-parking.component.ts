import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateParkingService } from '../../services/create-parking.service';
import { MapsComponent } from '../maps/maps.component';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { LocationInput } from '../../models/edit-parking-request.model';
import { MessageService } from 'primeng/api';
import { catchError, combineLatest, finalize, of } from 'rxjs';
import { Utility } from 'src/app/shared';


@Component({
  selector: 'app-edit-parking',
  templateUrl: './edit-parking.component.html',
  styleUrls: ['./edit-parking.component.scss']
})

export class EditParkingComponent implements OnInit {
  minDate: Date = new Date()
  truckTypes: any[] = [];
  parkingLotFacility: any[] = [];
  selectedOptions: any[] = [];
  noOptionsAvailable: boolean = false;
  count: number = 1
  buttonDisabled: boolean = false;
  facilitiesList: any[] = [];
  parkingForm!: FormGroup;
  isImgError1: boolean = false
  isImgError2: boolean = false
  isImgError3: boolean = false
  images: any[] = [];
  imageUrl2: string = '';
  imageUrl3: string = '';
  imageUrl1: any = [];
  btn1: boolean = false;
  btn2: boolean = false;
  btn3: boolean = false;
  totalTruckCategory = 0;
  id: string = '';
  maintenanceslots: any[] = [];
  selectedSlots: any[] = [];
  imagePreview: boolean = false
  imageLinkForPreview: string;
  visible: boolean = false;
  isEntireParkingNotAvaliable = false;
  noSlotSelected = true;

  entireParkingMaintanceList = [{ name: "Yes", value: "1" }, { name: "No", value: "0" }];
  constructor(private router: Router, private dialogService: DialogService, private parkingService: CreateParkingService,
    private fb: FormBuilder, private route: ActivatedRoute, private loaderService: LoaderService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.loaderService.hideLoader();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.buildForm();
      if (this.id) {
        this.bindAllData();
      }
    });
  }
  bindAllData(): void {
    this.loaderService.showLoader();
    combineLatest([
      this.parkingService.getVehicleTypeList()
        .pipe(
          catchError(() => {
            return of(null)
          }),
        ),
      this.parkingService.getparkingDetailById(this.id)
        .pipe(
          catchError(() => {
            return of(null)
          }),
        ),
      this.parkingService.getParkingLotDetailsWithSlots(this.id)
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
        ),
    ])
      .pipe(
        finalize(() => { this.loaderService.hideLoader() })
      )
      .subscribe({
        next: ([_vehicleData, _parkingLotData, _slot, _facilityData]) => {
          if (_vehicleData) {
            this.truckTypes = _vehicleData;
          }
          if (_facilityData) {
            this.facilitiesList = _facilityData;
          }
          if (_slot) {
            this.maintenanceslots = _slot.slotsUnderMaintenance;
            this.maintenanceslots.forEach((slot) => {
              if (slot.isMaintenance) {
                this.selectedSlots.push(slot);
              }
            });
          }

          if (_parkingLotData) {
            // Parking lot

            const isEntireParkingUnderMaintenance = _parkingLotData.isEntireParkingUnderMaintenance;

            this.parkingForm.patchValue({
              name: _parkingLotData.name,
              locAddress: _parkingLotData.location.address,
              location: _parkingLotData.location,
              hazardousLoadRate: _parkingLotData.hazardousLoadRate,
              offer: _parkingLotData.offer,
              taxAndFees: _parkingLotData.taxAndFees,
              truckType: _parkingLotData.truckType,
              totalSlots: _parkingLotData.totalNumberOfSlots,
              parkingLayoutImg: _parkingLotData.parkingLotLayout,
              startDate: (_parkingLotData.parkingLotMaintenanceStartDate),
              startTime: (_parkingLotData.parkingLotMaintenanceStartDate == null ? _parkingLotData.parkingLotMaintenanceStartDate : new Date(_parkingLotData.parkingLotMaintenanceStartDate)),
              endDate: (_parkingLotData.parkingLotMaintenanceEndDate),
              endTime: (_parkingLotData.parkingLotMaintenanceEndDate == null ? _parkingLotData.parkingLotMaintenanceEndDate : new Date(_parkingLotData.parkingLotMaintenanceEndDate)),
              isEntireParkingUnderMaintenance: isEntireParkingUnderMaintenance == true ? "1" : "0"
            });
            this.isEntireParkingNotAvaliable = isEntireParkingUnderMaintenance;
            this.addNewTruckType(_parkingLotData.truckType);
            this.facilitiesList.forEach(facility => {
              facility.checked = _parkingLotData.parkingLotFacility.some((item: any) => item.facilityId === facility.id);
              if (facility.checked) {
                this.parkingLotFacility.push(facility.id); // Push the checked facility ID into parkingLotFacility array
              }
            });
            this.btn1 = this.btn2 = this.btn3 = false;
            _parkingLotData.parkingLotImages.forEach((img: any, index: number) => {
              if (img.imagePath) {
                this.images.push(img.imagePath);
                if (index == 0) {
                  this.imageUrl1 = img.imagePath;
                  this.btn1 = true;
                }
                else if (index == 1) {
                  this.imageUrl2 = img.imagePath;
                  this.btn2 = true;
                }
                else {
                  this.imageUrl3 = img.imagePath;
                  this.btn3 = true;
                }
              }

              // end


            });
          }
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
      locAddress: ['', Validators.required],
      totalSlots: [''],
      parkingLayoutImg: [],
      startDate: [],
      startTime: [],
      endDate: [],
      endTime: [],
      isEntireParkingUnderMaintenance: []
    });
    this.parkingForm.get("locAddress").valueChanges.subscribe((location: string) => {
      
      if (!location) {
        const location: LocationInput = this.parkingForm.get('location')?.value;
        location.country = "";
        location.state =  "";
        location.latitude = null;
        location.longitude = null;
        location.address = "";
        location.streetView = "";
        this.parkingForm.patchValue({ location: location });
      }
    })
  }

  addNewTruckType(truckType: any): void {
    if (truckType.length > 0) {
      truckType.forEach((item: any) => {
        this.totalTruckCategory += 1;
        this.truckTypeArray.push(this.newTruckType(item));
      });
    }
    else {
      this.totalTruckCategory += 1;
      this.truckTypeArray.push(this.newTruckType({}));
    }
    this.selectTruckType();
  }

  newTruckType(truck: any): FormGroup {
    return this.fb.group({
      truckType: [truck.vehicleTypeId, [Validators.required]],
      hourly: [truck.fareChargesHourly, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      nightly: [truck.fareChargesNight, [Validators.required, Validators.pattern('^([0-9])+(\.[0-9]+)?$')]],
      weekly: [truck.fareChargesWeekly, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      slot1: [truck.overStayChargesTimeSlot1, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      slot2: [truck.overStayChargesTimeSlot2, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      slot3: [truck.overStayChargesTimeSlot3, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]]
    });
  }

  get truckTypeArray(): FormArray {
    return this.parkingForm.get("truckTypeArray") as FormArray
  }

  isFieldInvalid(fieldName: string) {
    const control = this.parkingForm.get(fieldName);
    return control?.invalid && (control?.touched || control?.dirty);
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
    if (data.value.startDate <= data.value.endDate && data.value.startTime <= data.value.endTime) {
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
        const isEntireParkingUnderMaintenance = data.get("isEntireParkingUnderMaintenance")?.value;
        data.get("isEntireParkingUnderMaintenance")?.patchValue(isEntireParkingUnderMaintenance == "1" ? true : false);
        data.get("parkingPhotos")?.patchValue(this.images);
        localStorage.setItem('truckData', JSON.stringify(truckData));
        localStorage.setItem('parkingFirstPage', JSON.stringify(data.value));
        const selectedMaintenance: string[] = [];
        this.selectedSlots.forEach((x: any) => {
          selectedMaintenance.push(x.slotName)
        })
        localStorage.setItem('selectedSlotsMian', JSON.stringify(selectedMaintenance));
        this.parkingSlots(this.id);
      }
      else {
        Utility.markFormGroupTouched(this.parkingForm);
      }
    }
    else {
      this.showErrorToast("End Date and time should be greater than Start Date and time")
    }
  }


  openMap() {
    const ref = this.dialogService.open(MapsComponent, {
      width: '70%',
      height: '100%',
      data: this.parkingForm.get('location')?.value
    });
    ref.onClose.subscribe((response: any) => {
      if (response) {
        const location: LocationInput = this.parkingForm.get('location')?.value;
        location.country = response.country;
        location.state = response.state;
        location.latitude = response.latitude;
        location.longitude = response.longitude;
        location.address = response.address;
        location.streetView = response.streetView;

        this.patchLocation(location);
      }
    });
  }

  parkingSlots(id: string) {
    this.router.navigateByUrl(`manager/parking/edit/slots/${id}`);
  }

  uploadImage1(event: any) {
    const formData = new FormData()
    const file = event.files[0];
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
      ).subscribe(
        response => {
          const data = response;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const name = key; // The property name is the document name
              const url = data[key];
              this.imageUrl3 = url;
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


  getFacilityControl(): FormControl {
    return this.parkingForm.get('fakeFacilities') as FormControl;
  }
  showSuccessToast(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
  showErrorToast(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
    });
  }
  showDialog(imageLink: string): void {
    this.imagePreview = true
    this.imageLinkForPreview = imageLink
    this.visible = true
  }
  onDialogHide(): void {
    this.visible = false;
  }
  entireParkingMaintance(value: string) {
    if (value == "1") {
      this.isEntireParkingNotAvaliable = true
      this.noSlotSelected = false
      this.selectedSlots = []
    }
    else {
      this.isEntireParkingNotAvaliable = false
      this.noSlotSelected = true
    }
  }
  searchAutoCompleteLocation(_location: any) {
    this.patchLocation(_location);
  }
  patchLocation(responseLocation: LocationInput): void {
    if (location) {
      const location: LocationInput = this.parkingForm.get('location')?.value;
      location.country = responseLocation.country;
      location.state = responseLocation.state;
      location.latitude = responseLocation.latitude;
      location.longitude = responseLocation.longitude;
      location.address = responseLocation.address;
      location.streetView = responseLocation.streetView;

      this.parkingForm.patchValue({
        locAddress: location.address,
        location: location
      });
    }
  }
}