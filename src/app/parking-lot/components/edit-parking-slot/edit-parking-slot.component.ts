import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { CreateParkingService } from '../../services/create-parking.service';
import { EditParkingRequest, ParkingLotFacilityInput, ParkingLotImagesInput, ParkingLotSlotsInput, TruckTypeInput } from '../../models/edit-parking-request.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { ParkingListService } from '../../services/parking-list.service';
import { DatePipe } from '@angular/common';
import { Utility } from 'src/app/shared';

@Component({
  selector: 'app-edit-parking-slot',
  templateUrl: './edit-parking-slot.component.html',
  styleUrls: ['./edit-parking-slot.component.scss']
})
export class EditParkingSlotComponent implements OnInit, AfterViewInit {
  parkingPageData: any;
  truckTypes: any[] = [];
  parkingSlotForm!: FormGroup;
  isParkingLayoutError: boolean = false
  planDoc: string = ''
  imageLink: string = ''
  upldBtn: boolean = true
  delIcon: boolean = false
  formData: FormData = new FormData();
  isProfileImgError: boolean = false;
  pdfUrl: string = '';
  parkingLotId: string = "";
  parkingLotSlotsOutput: any = [];
  uploadenable: boolean = false;
  uploadenable1: boolean = false;
  selectedSlotsMian: any[] = [];
  constructor(private fb: FormBuilder,
    private datePipe: DatePipe,
    private parkingService: ParkingListService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private createParkingService: CreateParkingService,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef) {

  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {

    this.loaderService.hideLoader();
    this.buildForm();
    this.getParkingLotId();
    this.parkingPageData = this.getDataFromStorage('parkingFirstPage');

    this.truckTypes = this.getDataFromStorage('truckData');
    this.selectedSlotsMian = this.getDataFromStorage('selectedSlotsMian');
    this.planDoc = this.parkingPageData.parkingLayoutImg;

    this.imageLink = this.parkingPageData.parkingLayoutImg;
    this.pdfUrl = this.parkingPageData.parkingLayoutImg;
    if (this.imageLink) {
      this.uploadenable = true;
      this.upldBtn = false
      this.delIcon = true
    }


  }

  getParkingLotDetailsWithSlots() {
    this.parkingService.getParkingLotDetailsWithSlots(this.parkingLotId)
      .subscribe({
        next: (data) => {
          this.parkingLotSlotsOutput = data.parkingLotSlotsOutput;
          this.bindData(this.parkingLotSlotsOutput);
        }
        , error: () => {
          this.bindData(this.parkingLotSlotsOutput);
        }
      })
  }
  getParkingLotId(): void {

    this.activatedRoute.params.subscribe((params) => {
      this.parkingLotId = params['id'];
      this.getParkingLotDetailsWithSlots();
    })
  }
  buildForm(): void {
    this.parkingSlotForm = this.fb.group({
      totalSlots: ['', [Validators.required]],
      truckTypeArray: this.fb.array([])
    });

  }
  bindData(slotData: any) {
    this.parkingSlotForm.patchValue({
      totalSlots: this.parkingPageData.totalSlots,
      // parkingLayoutImg :this.parkingPageData.parkingLayoutImg
    });

    this.truckTypes.forEach((x: any) => {
      this.cdr.detach();
      let sele = slotData.find((y: any) => y.vehicleTypeId == x.id);
      if (sele) {

        this.truckTypeArray.push(
          this.addNewTruck(sele)
        )
      }

      else {
        this.truckTypeArray.push(
          this.addEmptyNewTruck(x)
        )
      }
      this.cdr.detectChanges();
    });

    this.cdr.reattach();

  }
  addNewTruck(truck: any): FormGroup {
    return this.fb.group({
      id: [truck.vehicleTypeId, [Validators.required]],
      truckName: [truck.vehicleName],
      totalSlots: [truck.slots.length],
      parkingSlots: this.fb.array([...this.bindSlots(truck.slots)])
    }) as FormGroup;
  }
  addEmptyNewTruck(truck: any): FormGroup {
    return this.fb.group({
      id: [truck.id, [Validators.required]],
      truckName: [truck.name],
      totalSlots: [''],
      parkingSlots: this.fb.array([])
    }) as FormGroup;
  }
  private bindSlots(slots: any): FormGroup[] {
    const arr: FormGroup[] = [];
    slots.forEach((slot: any) => {
      arr.push(this.addNewParkingSlot(slot.slotName));
    })
    return arr;
  }

  get truckTypeArray(): FormArray {
    return this.parkingSlotForm.get("truckTypeArray") as FormArray
  }

  parkingSlotArray(slotIndex: number): FormArray {
    return this.truckTypeArray.at(slotIndex).get("parkingSlots") as FormArray
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
    let total = truckForm.get('totalSlots').value;
    let slots = truckForm.get('parkingSlots') as FormArray;
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
    let length = 1;
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
  editParking(): void {
    if (this.parkingSlotForm.valid) {
      let editParkingRequest: EditParkingRequest = {
        id: this.parkingLotId,
        name: this.parkingPageData.name,
        hazardousLoadRate: +this.parkingPageData.hazardousLoadRate,
        offer: +this.parkingPageData.offer,
        parkingLotLayout: this.planDoc,
        totalNumberOfSlots: this.parkingSlotForm.get('totalSlots')?.value,
        taxAndFees: +this.parkingPageData.taxAndFees,
        location: this.parkingPageData.location,
        truckType: this.getSelectedTruckTypes(),
        parkingLotFacility: this.getSelectedFacilities(),
        parkingLotImages: this.getSelectedParkingImages(),
        editParkingLotSlotsInput: this.getSelectedParkingLotSlots(),
        parkingLotMaintenanceStartDate: this.getFullDateTime(this.parkingPageData.startDate, this.parkingPageData.startTime),
        parkingLotMaintenanceEndDate: this.getFullDateTime(this.parkingPageData.endDate, this.parkingPageData.endTime),
        isEntireParkingUnderMaintenance: this.parkingPageData.isEntireParkingUnderMaintenance,
        underMaintenanceNames: this.selectedSlotsMian
      }
      let valid = true;

      editParkingRequest.truckType.forEach((truck: any) => {
        if (truck.numberOfSlots < 1) {
          this.showErrorToast('Number of slots should be greter than 0')
          valid = false;
        }
        else if (valid && truck.numberOfSlots > editParkingRequest.totalNumberOfSlots) {
          this.showErrorToast('Number of slots can not be more than total number of slots')
          valid = false;
        }
      });
      if (valid) {
        this.loaderService.showLoader();
        this.createParkingService.editParkingLot(editParkingRequest).subscribe({
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

    this.truckTypeArray.controls.forEach((truck, index) => {
      const slotArray = this.parkingSlotArray(index);
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
    this.truckTypeArray.controls.forEach((truck, index) => {
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
    const ref = this.dialogService.open(SuccessModalComponent, {
      data: {
        isEditMode: true
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
  deleteDocument(): void {
    this.formData = new FormData();
    this.imageLink = '';
    this.pdfUrl = '';
    this.upldBtn = true;
    this.delIcon = false;
    this.planDoc = "";
  }
  getFullDateTime(date: Date, dateTime: Date): string {
    if (date && dateTime) {
      const formatedDate = this.datePipe.transform(date, 'MM/dd/yyyy');
      const formatedTime = this.datePipe.transform(dateTime, 'HH:mm');
      return `${formatedDate} ${formatedTime}`;
    }
    else {
      return null;
    }
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
