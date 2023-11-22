import { NgModule } from '@angular/core';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './Components/transaction/transaction.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    TransactionComponent
  ],
  imports: [
    SharedModule,
    TransactionRoutingModule
  ]
})
export class TransactionModule { }
