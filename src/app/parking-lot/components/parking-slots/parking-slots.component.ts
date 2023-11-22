import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { CreateParkingService } from '../../services/create-parking.service';
import { CreateParkingRequest, ParkingLotFacilityInput, ParkingLotImagesInput, ParkingLotSlotsInput, TruckTypeInput } from '../../models/create-parking-request.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Utility } from 'src/app/shared';

@Component({
  selector: 'app-parking-slots',
  templateUrl: './parking-slots.component.html',
  styleUrls: ['./parking-slots.component.scss']
})
export class ParkingSlotsComponent implements OnInit {
  parkingPageData: any;
  truckTypes: any[] = [];
  parkingSlotForm!: FormGroup;
  isParkingLayoutError = false
  planDoc = ''
  imageLink = ''
  upldBtn = true
  delIcon = false
  formData = new FormData();
  isProfileImgError = false;
  pdfUrl = ''
  constructor(private fb: FormBuilder, private dialogService: DialogService, private createParkingService: CreateParkingService, private messageService: MessageService, private loaderService: LoaderService) {

  }
  ngOnInit(): void {
    this.loaderService.hideLoader();
    this.parkingPageData = this.getDataFromStorage('parkingFirstPage');
    this.truckTypes = this.getDataFromStorage('truckData');
    this.buildForm();

  }
  buildForm(): void {
    this.parkingSlotForm = this.fb.group({
      totalSlots: ['', [Validators.required]],
      truckTypeArray: this.fb.array([])
    });
    this.bindTruckArrayData();

  }
  bindTruckArrayData() {
    this.truckTypes.forEach((x: any) => {
      this.truckTypeArray().push(
        this.addNewTruck(x)
      )

    });

  }
  addNewTruck(truck: any): FormGroup {
    return this.fb.group({
      id: [truck.id, [Validators.required]],
      truckName: [truck.name],
      totalSlots: [''],
      parkingSlots: this.fb.array([])
    }) as FormGroup;
  }

  truckTypeArray(): FormArray {
    return this.parkingSlotForm.get("truckTypeArray") as FormArray
  }

  parkingSlotArray(slotIndex: number): FormArray {
    return this.truckTypeArray().at(slotIndex).get("parkingSlots") as FormArray
  }

  addNewParkingSlot(name: string) {
    return this.fb.group({
      slotName: [name, [Validators.required]],
    })
  }

  getDataFromStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) ?? "")
  }
  soltChange(truckForm: any): void {
    const total = truckForm.get('totalSlots').value;
    const slots = truckForm.get('parkingSlots') as FormArray;
    this.clearFormArray(slots);

    //const startChar = this.generateAlphaChar();
    const startChar = "A";
    for (let startVal = 1; startVal <= total; startVal += 1) {
      const slotVal = startVal < 10 ? `0${startVal}` : startVal;
      slots.push(this.addNewParkingSlot(`${startChar}${slotVal}`));
    }
  }

  clearFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  generateAlphaChar(): string {
    const length = 1;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  createParking(): void {
    if (this.parkingSlotForm.valid) {
      const createParkingRequest: CreateParkingRequest = {
        name: this.parkingPageData.name,
        hazardousLoadRate: +this.parkingPageData.hazardousLoadRate,
        offer: +this.parkingPageData.offer,
        rating: 0,
        companyLogo: null,
        aboutUs: null,
        parkingLotLayout: this.planDoc,
        totalNumberOfSlots: this.parkingSlotForm.get('totalSlots')?.value,
        taxAndFees: +this.parkingPageData.taxAndFees,
        location: this.parkingPageData.location,
        truckType: this.getSelectedTruckTypes(),
        parkingLotFacility: this.getSelectedFacilities(),
        parkingLotImages: this.getSelectedParkingImages(),
        parkingLotSlots: this.getSelectedParkingLotSlots()
      }
      let valid = true;
      createParkingRequest.truckType.forEach((truck: any) => {
        if (truck.numberOfSlots < 1) {
          this.showErrorToast('Number of slots should be greter than 0')
          valid = false;
        }
        else if (valid && truck.numberOfSlots > createParkingRequest.totalNumberOfSlots) {
          this.showErrorToast('Number of slots can not be more than total number of slots')
          valid = false;
        }
      });
      if (valid) {
        this.loaderService.showLoader();
        this.createParkingService.createParkingLot(createParkingRequest).subscribe({
          next: () => {
            this.showSuccessToast('Updated Succesfully');
            localStorage.removeItem('truckData');
            localStorage.removeItem('parkingFirstPage');
            this.loaderService.hideLoader();
            this.openSuccessModal();
          },
          error: (err: HttpErrorResponse) => {
            this.loaderService.hideLoader();
            this.showErrorToast(err.message);
          }
        })
      }
    }
    else {
      Utility.markFormGroupTouched(this.parkingSlotForm);
    }
  }

  getSelectedTruckTypes(): TruckTypeInput[] {
    const type: TruckTypeInput[] = [];
    const selectedTruck: any[] = this.parkingPageData.truckTypeArray;

    this.truckTypeArray().controls.forEach((truck) => {
      const truckData = selectedTruck.find(x => x.truckType == truck.get("id")?.value);
      const truckTypeInput: TruckTypeInput = {
        vehicleTypeId: truckData.truckType,
        numberOfSlots: +truck.get("totalSlots")?.value,
        fareChargesHourly: +truckData.hourly,
        fareChargesNight: +truckData.nightly,
        fareChargesWeekly: +truckData.weekly,
        overStayChargesTimeSlot1: +truckData.slot1,
        overStayChargesTimeSlot2: +truckData.slot2,
        overStayChargesTimeSlot3: +truckData.slot3,
      }
      type.push(truckTypeInput);

    });

    return type;
  }
  getSelectedFacilities(): ParkingLotFacilityInput[] {
    const type: ParkingLotFacilityInput[] = [];
    const parkingLotFacility: any[] = this.parkingPageData.parkingLotFacility;

    parkingLotFacility.forEach((facility) => {
      type.push({
        facilityId: facility
      })
    })
    return type;
  }
  getSelectedParkingImages(): ParkingLotImagesInput[] {
    const type: ParkingLotImagesInput[] = [];
    const parkingPhotoData: any[] = this.parkingPageData.parkingPhotos;

    parkingPhotoData.forEach((url) => {
      type.push({
        imagePath: url
      })
    })
    return type;
  }
  getSelectedParkingLotSlots(): ParkingLotSlotsInput[] {
    const type: ParkingLotSlotsInput[] = [];
    this.truckTypeArray().controls.forEach((truck, index) => {
      const slotArray = this.parkingSlotArray(index);
      slotArray.controls.forEach((slot) => {
        type.push({
          vehicleTypeId: truck.get("id")?.value,
          slotName: slot.get("slotName")?.value
        })
      });
    });
    return type;
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
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
  openSuccessModal(): void {
    this.dialogService.open(SuccessModalComponent, {
      data: {
        isEditMode: false
      }
    });
  }

  onUpload(files: any, fileUpload: any) {
    const img = files[0].name;
    const fileExtension = img.split('.').pop();
    const file = files[0];
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      this.isProfileImgError = true;
      fileUpload.clear()
      return
    }
    this.loaderService.showLoader();
    this.isProfileImgError = false
    this.formData.append('Images', file, file.name);
    this.createParkingService.imageUplaod(this.formData)
      .subscribe({
        next: (response) => {
          const data = response;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const name = key; // The property name is the document name
              const url = data[key];
              if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'PNG') {
                this.planDoc = url
                this.imageLink = url;
                this.upldBtn = false;
                this.delIcon = true;
              }
              else {
                this.pdfUrl = url;
                this.planDoc = url
                this.upldBtn = false;
                this.delIcon = true;
              }




            }
          }
          this.loaderService.hideLoader();
        },
        error: () => {
          this.loaderService.hideLoader();
        }
      })
  }
  deleteDocument(): void {
    this.formData = new FormData();
    this.imageLink = ''
    this.pdfUrl = ''
    this.upldBtn = true
    this.delIcon = false
  }
  onDrop(event: any, fileUpload: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.onUpload(files, fileUpload);
  }

  onDragOver(event: any) {

    event.preventDefault();
  }

  onDragLeave(event: any) {

    event.preventDefault();
  }
}
