import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[mapAutoComplete]'
})
export class MapAutoCompleteDirective {
  @Output() onSearch = new EventEmitter();
  constructor(private eleRef: ElementRef) {

    const input = this.eleRef.nativeElement as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);

    // Listen for the 'place_changed' event when the user selects a suggestion
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        console.log('Place details not found for the input.');
        return;
      }
      const formattedLocation = {
        country: place.address_components!.find(
          (component) => component.types.includes('country')
        )?.long_name || '',
        state: place.address_components!.find(
          (component) =>
            component.types.includes('administrative_area_level_1')
        )?.long_name || '',
        latitude: place.geometry.location!.lat(),
        longitude: place.geometry.location!.lng(),
        address: place.formatted_address || '',
        streetView: `https://www.google.com/maps/@${place.geometry.location!.lat()},${place.geometry.location!.lng()},16z?hl=en&q=${place.geometry.location!.lat()},${place.geometry.location!.lng()}`,
      };

      this.onSearch.emit(formattedLocation)
    });
  }

}
