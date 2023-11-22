import { NgModule } from '@angular/core';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ReviewsComponent
  ],
  imports: [
    SharedModule,
    ReviewRoutingModule
  ]
})
export class ReviewModule { }
