import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateParkingComponent } from './components/create-parking/create-parking.component';
import { ParkingSlotsComponent } from './components/parking-slots/parking-slots.component';
import { ParkingListComponent } from './components/parking-list/parking-list.component';
import { EditParkingComponent } from './components/edit-parking/edit-parking.component';
import { ViewParkingComponent } from './components/view-parking/view-parking.component';
import { EditParkingSlotComponent } from './components/edit-parking-slot/edit-parking-slot.component';

const routes: Routes = [
  {
    path: '',
    component: ParkingListComponent
  },
  {
    path: 'create',
    component: CreateParkingComponent
  },
  {
    path: 'edit/:id',
    component: EditParkingComponent
  },
  {
    path: 'edit/slots/:id',
    component: EditParkingSlotComponent
  },
  {
    path: 'slots',
    component: ParkingSlotsComponent
  },
  {
    path: 'view/:id',
    component: ViewParkingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkingLotRoutingModule { }
