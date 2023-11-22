import { Injectable } from '@angular/core';
import { APIService } from 'src/app/shared';


@Injectable({
  providedIn: 'root'
})
export class CompanyDetailsService {

  constructor(private apiService: APIService) { }


  getCompanyDetails() {
    return this.apiService.get<any>('Company/GetCompanyDetailsByCompanyId');
  }

  createCompanyDetails(data: any) {
    return this.apiService.postWithAllResponse<any>('Company/CreateCompanyDetails', data,);
  }

  imageUplaod(data: any = []) {
    return this.apiService.post<any>('User/ImageUpload', data);
  }
  editCompanyDetails(data: any) {
    return this.apiService.post<any>('Company/EditCompanyProfileDetails', data);
  }

}
