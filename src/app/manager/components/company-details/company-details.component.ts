import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms'; // Import FormGroup and FormBuilder
import { MessageService } from 'primeng/api';
import { Validators } from '@angular/forms';
import { CompanyDetailsService } from '../../services/company-details.service';
import { DEFAULT_COMPANY_PP, EMAIL_VALIDATION_PATTERN, LoaderService, NAME_VALIDATION_PATTERN, Utility } from 'src/app/shared';
import { finalize } from 'rxjs';

export interface formData {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  imageUrl: string = DEFAULT_COMPANY_PP;
  companyDetails: FormGroup;
  documentData: any[] = [];
  uploadBtn: boolean = false
  imgLink: string = DEFAULT_COMPANY_PP;
  getCompanyData: any;
  isProfileImgError: boolean = false
  showSave: boolean = false;
  showEdit: boolean = false;
  showCancel: boolean = false;
  removeDocButton: boolean = false
  showUpdate: boolean = false;
  disableForm: boolean = false;
  selectedFiles: File[] = [];
  filesArray: File[] = [];
  formData: FormData = new FormData();
  message: string = '';
  newCompanyDocs: any[] = [];

  constructor(
    private companyService: CompanyDetailsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loaderService: LoaderService) {

    this.companyDetails = this.formBuilder.group({
      companyId: [''],
      documents: [
        {
          id: null,
          name: '',
          path: '',
          isDeleted: false
        }
      ],
      companyLogoPath: ['', [this.fileSizeValidator(5)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_VALIDATION_PATTERN)]],
      addressLine1: ['', [Validators.required, Validators.minLength(3)]],
      addressLine2: [''],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.pattern(NAME_VALIDATION_PATTERN)]],
      state: ['', [Validators.required, Validators.pattern(NAME_VALIDATION_PATTERN)]],
      country: ['', [Validators.required, Validators.pattern(NAME_VALIDATION_PATTERN)]],
      aboutCompany: ['']

    });
  }

  ngOnInit(): void {
    this.loaderService.showLoader()
    this.getCompanyDetails();
  }



  getCompanyDetails() {
    this.companyService.getCompanyDetails()
      .subscribe(
        {
          next: (response: any) => {
            this.getCompanyData = response;
            if (this.getCompanyData.companyLogoPath) {
              this.imageUrl = this.getCompanyData.companyLogoPath;
              this.imgLink = this.getCompanyData.companyLogoPath;
            }

            this.patchForm(this.getCompanyData);
            if (this.getCompanyData) {
              this.showEdit = true;
            } else {
              this.showSave = true;
              this.showCancel = true;
              this.uploadBtn = true;
            }
          },
          error: () => {
            this.showSave = true;
            this.showCancel = true;
          }
        });
  }

  patchForm(getCompanyData: any) {
    if (getCompanyData) {
      this.companyDetails.patchValue({
        companyId: getCompanyData.id || '',
        companyLogoPath: getCompanyData.companyLogoPath || '',
        name: getCompanyData.companyName || '',
        mobileNumber: getCompanyData.mobileNumber || '',
        email: getCompanyData.email || '',
        addressLine1: getCompanyData.addressLine1 || '',
        addressLine2: getCompanyData.addressLine2 || '',
        pincode: getCompanyData.pincode || '',
        city: getCompanyData.city || '',
        state: getCompanyData.state || '',
        country: getCompanyData.country || '',
        aboutCompany: getCompanyData.aboutCompany || '',
        documents: [
          {
            id: getCompanyData.documents.id || '',
            name: getCompanyData.documents.name,
            path: '',
            isDeleted: false
          }
        ],
      });
      this.loaderService.hideLoader()
      this.disableForm = true;
    }
  }

  createCompanyDetails() {
    Utility.markFormGroupTouched(this.companyDetails);
    //const data = this.uploadDocument();
    const input = {
      name: this.companyDetails.value.name,
      companyLogoPath: '',
      mobileNumber: this.companyDetails.value.mobileNumber,
      email: this.companyDetails.value.email,
      addressLine1: this.companyDetails.value.addressLine1,
      addressLine2: this.companyDetails.value.addressLine2,
      pincode: this.companyDetails.value.pincode,
      city: this.companyDetails.value.city,
      state: this.companyDetails.value.state,
      country: this.companyDetails.value.country,
      documents: this.newCompanyDocs,
      aboutCompany: this.companyDetails.value.aboutCompany
    }


    if (this.companyDetails.valid) {
      this.companyService.createCompanyDetails(input).subscribe({
        next: (response) => {
          const message = response.message;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
          this.showCancel = false;
          this.showSave = false;
          this.showEdit = true;
          this.uploadBtn = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please check the values' });
        }
      })
    }


  }

  removeDocument(id: number) {
    const index = this.getCompanyData.documents.findIndex((document: any) => document.id === id);


    if (index !== -1) {
      // Create a new object for the specific document with isDeleted set to true
      const updatedDocument = {
        ...this.getCompanyData.documents[index],
        isDeleted: true,
      };

      // Create a new array with the updated document at the same index
      const updatedDocuments = [...this.getCompanyData.documents];
      updatedDocuments[index] = updatedDocument;

      // Update the 'documents' property with the new array
      this.getCompanyData.documents = updatedDocuments;
    }
    //this.getCompanyData.documents.splice(index, 1);

  }


  btnEdit() {
    this.showEdit = false;
    this.showCancel = true;
    this.showUpdate = true;
    this.disableForm = false;
    this.uploadBtn = true
    this.removeDocButton = true
  }

  updateCompanyDetails(data: any) {    // this.companyDetails.get('companyLogoPath')?.setValue(this.imageUrl);

    this.companyDetails.controls['name'].markAsTouched();
    this.companyDetails.controls['mobileNumber'].markAsTouched();
    this.companyDetails.controls['email'].markAsTouched();
    this.companyDetails.controls['addressLine1'].markAsTouched();
    this.companyDetails.controls['pincode'].markAsTouched();
    this.companyDetails.controls['city'].markAsTouched();
    this.companyDetails.controls['state'].markAsTouched();
    this.companyDetails.controls['country'].markAsTouched();

    // const updatedDocuments = [...this.getCompanyData.documents];
    // Set the documents in the form with the updated array
    this.companyDetails.get('documents')?.setValue(this.getCompanyData.documents);
    if (this.companyDetails.valid) {
      this.companyService.editCompanyDetails(data.value).subscribe(
        {
          next: (response: any) => {
            this.getCompanyData = response;
            this.showSuccessToast('Updated Succesfully');
            this.showCancel = false;
            this.showUpdate = false;
            this.showEdit = true;
            this.disableForm = true;
            this.isProfileImgError = false;
            this.removeDocButton = false;
            this.uploadBtn = false;
          }
        });
    } else {
      this.showErrorToast('Inputs are Invalid');
    }
  }




  onCancel() {
    if (this.showUpdate == true && this.showCancel == true) {
      this.isProfileImgError = false;
      this.showCancel = false;
      this.showUpdate = false;
      this.showEdit = true;
      this.disableForm = true;
      this.uploadBtn = false
      this.removeDocButton = false
      this.getCompanyDetails();
    }
    else if (this.showSave == true && this.showCancel == true) {
      this.companyDetails.reset();
    }
  }

  onFileSelected(event: any) {

    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }
    const maxSize = 5 * 1024 * 1024;
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];
    this.selectedFiles.forEach((file) => {
      if (file.size <= maxSize) {
        // File size is within the limit, append it to formData
        validFiles.push(file);
      } else {

        invalidFiles.push(file);
      }
    });
    validFiles.forEach((file) => { this.formData.append('Images', file); });
    invalidFiles.forEach((file) => {
      this.message = (`File "${file.name}" size exceeds the limit (5MB). Please select a smaller file.`);
    });
    if (invalidFiles.length > 0) {
      this.showErrorToast(this.message)
    }
    let myFormData: FormData = new FormData();

    for (let i = 0; i < this.selectedFiles.length; i++) {

      validFiles.forEach((file) => {
        myFormData.append('Images', file, file.name);
      });
    }
    this.loaderService.showLoader();
    this.companyService.imageUplaod(myFormData)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe({
        next: (response: any) => {
          const data = response;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const name = key; // The property name is the document name
              const url = data[key]; // The property value is the document URL

              const newDocument = {
                id: null, // You can set an appropriate ID if needed
                name: name,
                path: url,
                isDeleted: false
              };

              // Add the new document to the documents array
              const docsArray = [...this.getCompanyData.documents]
              docsArray.push(newDocument);
              this.getCompanyData.documents = docsArray;
              event.target.value = '';
            }
          }

        },
        error: (error) => {
          console.error('Error uploading documents:', error);
        }
      });

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



  onImageSelected(event: any) {
    const files = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;
    if (files.size > maxSize) {
      this.isProfileImgError = true;
      this.companyDetails.get('companyLogoPath')?.setValue(this.imgLink);
      return
    }
    this.isProfileImgError = false;

    this.companyDetails.get('companyLogoPath')?.setValue(files);
    this.formData.append('Images', files, files);
    this.loaderService.showLoader();
    this.companyService.imageUplaod(this.formData)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe({
        next: response => {
          const data = response;
          if (this.getCompanyData != undefined) {
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const name = key; // The property name is the document name
                const url = data[key];
                this.imageUrl = url
                this.companyDetails.get('companyLogoPath')?.setValue(url);
              }
            }
          }
          else {
            if (this.newCompanyDocs.length > 0) {
              this.newCompanyDocs = []
            }
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const name = key; // The property name is the document name
                const url = data[key]; // The property value is the document URL

                const newDocument = {
                  // You can set an appropriate ID if needed
                  name: name,
                  path: url,
                };

                this.newCompanyDocs.push(newDocument)
                this.removeDocButton = true

              }
            }
          }
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
  newRemoveDocument(name: string) {
    const index = this.newCompanyDocs.findIndex((document: any) => document.name === name);
    this.newCompanyDocs.splice(index, 1);
  }
  getAllNotDeletedDocuments() {
    return this.getCompanyData.documents.filter(x => x.isDeleted == false);
  }
}



