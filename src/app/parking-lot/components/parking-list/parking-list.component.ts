import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParkingListService } from '../../services/parking-list.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MessageService } from 'primeng/api';
import { Parking, ParkingListRequest, ParkingListResponse } from '../../models/parking-list.model';

@Component({
  selector: 'app-parking-list',
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.scss']
})
export class ParkingListComponent implements OnInit {
  searchQuery = '';
  parkingList: Parking[] = [];
  first = 0;
  rows = 10;
  totalItems!: number;
  itemsPerPage = 10;
  paginatedItems: any = [];
  currentPage = 1;

  constructor(
    private router: Router,
    private listService: ParkingListService,
    private loaderService: LoaderService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.loaderService.hideLoader();
    this.getParkingLotsByManagerId();
  }

  createParking() {
    this.router.navigateByUrl('/manager/parking/create');
  }

  getParkingLotsByManagerId() {
    this.loaderService.showLoader();
    const parkingListRequest: ParkingListRequest = {
      search: this.searchQuery.toLowerCase(),
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage
    }
    this.listService.getParkingLotsByManagerId(parkingListRequest)
      .subscribe(
        {
          next: (response: ParkingListResponse) => {
            this.parkingList = response.parkingList;
            this.totalItems = response.totalRecords;
            this.loaderService.hideLoader();
          },
          error: () => {
            this.loaderService.hideLoader();
            this.parkingList = [];
            this.totalItems = 0;
            this.currentPage = 1;
          }
        })
  }
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.getParkingLotsByManagerId();
  }

  showCount(vehicleCount: number): boolean {
    return vehicleCount > 3;
  }
  viewParkingDetailsById(id: string) {
    this.router.navigate(['/manager/parking/view', id])
  }
  getVehicleAllowed(vehicleList: any) {
    if (vehicleList) {
      const size = 3;
      return vehicleList.slice(0, size);
    }
    else {
      return [];
    }
  }
  filterItems(): void {

    this.searchQuery = this.searchQuery.toLowerCase();
    if (this.searchQuery == '') {
      this.getParkingLotsByManagerId()
    } else {
      this.loaderService.showLoader();
      const parkingListRequest: ParkingListRequest = {
        search: this.searchQuery.toLowerCase(),
        pageNumber: 1,
        pageSize: this.itemsPerPage
      }
      this.listService.getParkingLotsByManagerId(parkingListRequest).subscribe({

        next: (response) => {
          this.parkingList = response.parkingList;
          this.totalItems = response.totalRecords;
          this.loaderService.hideLoader();
        },
        error: () => {
          this.loaderService.hideLoader();
          this.showWarningToast("No Records Found")
          this.getParkingLotsByManagerId()
        }
      });
    }
  }
  editParkingNavigation(parkingId: string): void {
    this.router.navigate(['manager/parking/edit', parkingId])
  }
  showWarningToast(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
    });
  }
}
