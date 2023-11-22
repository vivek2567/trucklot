import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkingListService } from '../../services/parking-list.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-view-parking',
  templateUrl: './view-parking.component.html',
  styleUrls: ['./view-parking.component.scss']
})
export class ViewParkingComponent {

  id: string = "";
  name: string = '';
  parkingLocation: string = '';
  hazardousLoadRate: number = 0;
  offer: number = 0;
  fareChargesHourly: number = 0;
  fareChargesnight: number = 0;
  fareChargesWeekly: number = 0;
  extendedtimechargesHR: number = 0;
  extendedtimechargesnight: number = 0;
  extendedtimechargesweekly: number = 0;
  facilities: any[] = [];
  parkingLotLayout: string = '';
  parkingLotImages: any = [];
  parkingLotSlotsOutput: any = [];
  isDisabled: boolean = true;

  //fareChargesHourly : number = 0;
  constructor(
    private parkingService: ParkingListService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private router:Router) { }
  truckTypes: any = [];

  ngOnInit() {
    this.loaderService.hideLoader();
    this.onUrl();
    this.getParkingDataById();
    this.getParkingLotSlotsWithDetail();
  }


  onUrl() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    })


  }


  toggleCheckboxState() {
    this.isDisabled = !this.isDisabled;
  }
  getParkingDataById() {
    this.loaderService.showLoader();
    this.parkingService.getParkingLotsById(this.id).subscribe({
      next: (data: any) => {
        this.name = data.name
        this.parkingLocation = data.location.address;
        this.hazardousLoadRate = data.hazardousLoadRate;
        this.offer = data.offer;
        this.truckTypes = data.truckType;
        this.parkingLotImages = data.parkingLotImage;
        this.facilities = data.parkingLotFacility;
        this.parkingLotLayout = data.parkingLotLayout;
        this.parkingLotImages = data.parkingLotImages;
        this.loaderService.hideLoader();

      }, error: () => {
        this.loaderService.hideLoader();
      }
    })
  }
  //For Checkbox Enable Disable
  isCheckboxDisabled(facilityName: string): boolean {
    if (facilityName === "CCTV") {
      return true;
    }
    // Otherwise, return false to enable the checkbox.
    return false;
  }
  getParkingLotSlotsWithDetail() {
    this.parkingService.getParkingLotDetailsWithSlots(this.id).subscribe({
      next: (data) => {
        this.parkingLotSlotsOutput = data.parkingLotSlotsOutput
      }
      , error: (err) => {
        console.error(err);
      }
    })
  }
  editParkingNavigation(): void {
    this.router.navigate(['manager/parking/edit', this.id])
  }
}
