import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessModalComponent } from './success-modal.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';


describe('SuccessModalComponent', () => {
    let component: SuccessModalComponent;
    let fixture: ComponentFixture<SuccessModalComponent>;
    let router: Router;
    let ref: DynamicDialogRef;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SuccessModalComponent],
            providers: [
                DynamicDialogRef,
                { provide: DynamicDialogConfig, useValue: { data: { isEditMode: false } } }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        fixture = TestBed.createComponent(SuccessModalComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        ref = TestBed.inject(DynamicDialogRef);

        fixture.detectChanges();
    });

    it('should create the component', () => {

        expect(component).toBeTruthy();
    });

    it('should set the bodyText in ngOnInit for creation mode', () => {
        // Arrange
        spyOn(component, 'continue');

        // Act
        component.ngOnInit();

        // Assert
        expect(component.bodyText).toEqual('Your vehicle parking lot has been successfully created.');
    });

    it('should close the dialog and navigate to the parking-lot route on continue', () => {
        // Arrange
        spyOn(ref, 'close');
        spyOn(router, 'navigateByUrl');

        // Act
        component.continue();

        // Assert
        expect(ref.close).toHaveBeenCalled();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/manager/parking');
    });
});
