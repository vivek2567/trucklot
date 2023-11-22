import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean = false;

  showLoader(): void {
    this.loading = true;
  }
  hideLoader(): void {
    this.loading = false;
  }

  getLoading(): boolean {
    return this.loading;
  }
}
