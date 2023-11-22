import { NgModule } from '@angular/core';

import { MessageRoutingModule } from './message-routing.module';
import { MessagesComponent } from './components/messages/messages.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    SharedModule,
    MessageRoutingModule
  ]
})
export class MessageModule { }
