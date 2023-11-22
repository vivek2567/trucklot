import { FormGroup } from "@angular/forms";

export abstract class Utility {
    // set mark as touch given form group
    public static markFormGroupTouched(formGroup: FormGroup): void {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
    public static getLocalTimeZone(): string {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timeZone;
    }
}
