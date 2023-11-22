import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EnquiryRequest } from '../models/enquiry.model';
import { EmptyApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  constructor(private apiService: APIService) {

  }
  createEnquiry(requestLandingModel: EnquiryRequest) {
    return this.apiService.postWithAllResponse<EmptyApiResponse>('Enquiry/CreateEnquiry', requestLandingModel)
  }
}
