import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit {
  bodyText = '';
  constructor(private router: Router, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {

    if (this.config.data.isEditMode) {
      this.bodyText = 'Your vehicle parking lot has been successfully updated.';
    }
    else {
      this.bodyText = 'Your vehicle parking lot has been successfully created.';
    }
  }

  continue(): void {
    this.ref.close();
    this.router.navigateByUrl('/manager/parking');
  }
}
