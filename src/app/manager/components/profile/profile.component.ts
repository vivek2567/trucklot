import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'; // Import FormGroup and FormBuilder
import { DEFAULT_PP, EMAIL_VALIDATION_PATTERN, LoaderService, NAME_VALIDATION_PATTERN } from 'src/app/shared';
import { ProfileService } from '../../services/profile.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: []

})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  formData: FormData = new FormData();
  imageUrl: string = DEFAULT_PP;
  uploadBtn: boolean = false
  showSave: boolean = false;
  showEdit: boolean = true;
  showCancel: boolean = false;
  imgLink: string = DEFAULT_PP;
  showUpdate: boolean = false;
  disableForm: boolean = true
  id: string = ''
  userData: any;
  userForm: FormGroup;
  isProfileImgError = false;
  constructor(private service: ProfileService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private loaderService: LoaderService) {
    this.userForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern(NAME_VALIDATION_PATTERN)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_VALIDATION_PATTERN)]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(9), Validators.maxLength(15)]],
      profileImagePath: ['', [this.fileSizeValidator(5)]]
    })
  }

  ngOnInit() {
    this.loaderService.showLoader()
    this.id = this.authService.getUserId();
    this.getUserdeatil()
  }

  patchForm(userData: any) {

    if (userData) {
      this.userForm.patchValue({
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        mobileNumber: userData.mobileNumber || '',
        profileImagePath: userData.profileImagePath || ""
      })
      this.loaderService.hideLoader()
    }
  }
  getUserdeatil() {
    this.service.getUserById(this.id).subscribe({
      next: (response: any) => {
        this.userData = response
        this.patchForm(this.userData)
        if (this.userData.profileImagePath) {
          this.imageUrl = this.userData.profileImagePath;
          this.imgLink = this.userData.profileImagePath;
        }
      }
    })
  }
  btnEdit() {
    this.showEdit = false;
    this.showCancel = true;
    this.showUpdate = true;
    this.disableForm = false;
    this.uploadBtn = true

  }
  onCancel() {
    if (this.showUpdate == true && this.showCancel == true) {
      this.getUserdeatil();
      this.isProfileImgError = false;
      this.showCancel = false;
      this.showUpdate = false;
      this.showEdit = true;
      this.disableForm = true;
      this.uploadBtn = false
    }
    else if (this.showSave == true && this.showCancel == true) {
      this.userForm.reset();
    }
  }
  submit(data: any) {
    this.userForm.controls['name'].markAsTouched();
    this.userForm.controls['mobileNumber'].markAsTouched();
    this.isProfileImgError = false;
    if (this.userForm.valid) {
      this.showSuccessToast('Updated Succesfully')
      this.service.editManagerDetail(data.value).subscribe({
        next: (response: any) => {
          const profileData: any = { name: response.name, img: response.profileImagePath };
          this.service.setProfileData(profileData);
          this.getUserdeatil()

        }
      });
      this.showEdit = true
      this.showUpdate = false
      this.disableForm = true
      this.showCancel = false
      this.uploadBtn = false
    }
    else {
      this.showErrorToast('Inputs are invalid')
      this.showEdit = false
      this.showUpdate = true
      this.disableForm = false
      this.showCancel = true
    }
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
      return
    }
    this.isProfileImgError = false;
    this.userForm.get('profileImagePath')?.setValue(files);
    this.formData.append('Images', files, files);
    this.loaderService.showLoader();
    this.service.imageUplaod(this.formData)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe({
        next:
          response => {
            const data = response;
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const name = key; // The property name is the document name
                const url = data[key];
                this.imageUrl = url
                this.userForm.get('profileImagePath')?.setValue(url);
              }
            }
          }
      });
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
}
