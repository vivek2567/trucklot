import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { LandingService } from '../shared/services/landing.service';
import { EMAIL_VALIDATION_PATTERN, LoaderService, Utility } from '../shared';
import { EnquiryRequest } from '../shared/models/enquiry.model';
import { EmptyApiResponse } from '../shared/models/api-response.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  landingForm: FormGroup
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private landingService: LandingService,
    private messageService: MessageService,
    private loaderService: LoaderService) {

  }

  ngOnInit(): void {
    this.landingForm = this.formbuilder.group({
      name: ['', Validators.required],
      businessName: [''],
      email: ['', [Validators.required, Validators.pattern(EMAIL_VALIDATION_PATTERN)]],
      phoneNumber: ['', Validators.pattern('[0-9]*')],
      message: ['']
    })
  }

  createEnquiry(): void {
    if (this.landingForm.valid) {
      this.loaderService.showLoader();
      const enquiryRequest: EnquiryRequest = Object.assign({}, this.landingForm.value);
      this.landingService.createEnquiry(enquiryRequest)
        .pipe(
          finalize(() => { this.loaderService.hideLoader(); })
        )
        .subscribe({
          next: (responseLandingModel: EmptyApiResponse) => {
            this.showSuccessToast(responseLandingModel.message);
            this.landingForm.reset();
          }
        })
    }
    else {
      Utility.markFormGroupTouched(this.landingForm);
    }

  }
  goLoginScreen(): void {
    this.router.navigate(["manager-login"]);
  }
  showSuccessToast(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
}
