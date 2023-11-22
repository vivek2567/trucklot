
import { OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


declare const google: any;
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @ViewChild('mapElement', { static: true }) mapElement: any;
  receivedData: any;
  geocoder?: any = null;
  title = 'AppComponent'
  map: any;
  marker: any = null;
  streetViewLink = '';
  clickedLocation: any
  count: number = 0;
  formattedLocation: any;
  markerPosition: {
    lat: number
    lng: number
  } | undefined;
  searchLocationMarker: any;

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.receivedData = this.config.data;
    this.openMap()
  }

  openMap(): void {
    if (this.receivedData) {
      this.markerPosition = {
        lat: this.receivedData.latitude,
        lng: this.receivedData.longitude
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        //center:{lat:34.746483,lng:-92.289597 },
        center: { lat: this.receivedData.latitude, lng: this.receivedData.longitude },
        zoom: 15,
      })
      this.searchLocationMarker = new google.maps.Marker({
        position: this.markerPosition,
        map: this.map,
        title: 'Your Location'
      })

    }
    else {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: 34.746483, lng: -92.289597 },
        zoom: 10,
      })

    }
    this.geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.handleMapClick(event);
    });
  }
  // getCurrentLocation(): void {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const userLocation = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };
  //       new google.maps.Marker({
  //         position: userLocation,
  //         map: this.map,
  //         title: 'Your Location'
  //       });
  //       this.map.setCenter(userLocation);
  //     }, (error) => {
  //       console.error('Error getting user location:', error);
  //     });
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // }
  selectLocation(): void {
    if (this.formattedLocation) {
      this.ref.close(this.formattedLocation);
    }
    else {
      this.ref.close(this.receivedData);

    }
  }
  cancel() {
    if (this.receivedData) {
      this.ref.close(this.receivedData);
    }
    else {
      this.ref.close();
    }
  }
  handleMapClick(event: any): void {


    this.searchLocationMarker?.setMap(null)
    this.marker?.setMap(null)
    // Get the latitude and longitude of the clicked location
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    this.streetViewLink = `https://www.google.com/maps/@${clickedLocation.lat},${clickedLocation.lng},16z?hl=en&q=${clickedLocation.lat},${clickedLocation.lng}`;
    this.marker?.setMap(null);
    this.marker = new google.maps.Marker({
      position: clickedLocation,
      map: this.map,
      title: 'Your Location'
    });
    let location: any = {
      streetAddress: '', // Initialize the streetAddress property
    };
    this.geocoder?.geocode({ location: clickedLocation }, (results, status) => {
      if (status === 'OK') {
        if (results && results[0]) {
          const addressComponents = results[0].address_components;
          //long_name
          let locAddress = results[0].formatted_address;
          // Extract city, state, and zip code from address components
          for (const component of addressComponents) {
            if (component.types.includes('route') || component.types.includes('street_number')) {
              location.streetAddress += component.long_name + ' ';
            } else if (component.types.includes('administrative_area_level_1')) {
              location.state = component.long_name;
            } else if (component.types.includes('country')) {
              location.country = component.long_name;
            }
          }
          location.latitude = clickedLocation.lat;
          location.longitude = clickedLocation.lng;
          location.streetViewLink = this.streetViewLink
          // Add address and streetView properties (You need to set streetView accordingly)
          location.address = location.streetAddress; // You can modify this as needed

          // Create the final formatted location object
          this.formattedLocation = {
            country: location.country || '',
            state: location.state || '',
            latitude: location.latitude || '',
            longitude: location.longitude || '',
            address: locAddress || '',
            streetView: location.streetViewLink || '',
          };
        } else {
          console.error('No results found for the given location.');
        }
      }
    });
  }
}
