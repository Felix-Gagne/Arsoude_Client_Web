import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-creation-pt2',
  templateUrl: './creation-pt2.component.html',
  styleUrls: ['./creation-pt2.component.css']
})
export class CreationPt2Component {
  latitudeA?: number;
  longitudeA?: number;
  latitudeB?: number;
  longitudeB?: number;
  currentMode: 'PointA' | 'PointB' = 'PointA';
  center: google.maps.LatLngLiteral = { lat: 45.53784, lng: -73.49244 };
  zoom = 15;

  markerPositions: google.maps.LatLngLiteral[] = [
    {lat: 42, lng: -4},
    {lat: 40, lng: -0},
    {lat: 38, lng: -8},
  ];

  polylineOptions = {
    path: this.markerPositions,
    strokeColor: '#32a1d0',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  };

  latitude: number = 0;
  longitude: number = 0;

  @ViewChild('googlemaps') map!: GoogleMap;
  @ViewChild('maplines') maplines!: GoogleMap;

  getLatLngFromMap(event: google.maps.MapMouseEvent): void {
    const newMarker: google.maps.LatLngLiteral = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    };
  
    if (this.currentMode === 'PointA') {
      this.latitudeA = newMarker.lat;
      this.longitudeA = newMarker.lng;
    } else if (this.currentMode === 'PointB') {
      this.latitudeB = newMarker.lat;
      this.longitudeB = newMarker.lng;
    }
  
    const existingMarkerIndex = this.markerPositions.findIndex(
      (marker) =>
        marker.lat === newMarker.lat && marker.lng === newMarker.lng
    );
  
    if (existingMarkerIndex !== -1) {
      this.markerPositions[existingMarkerIndex] = newMarker;
    } else {
      this.markerPositions.push(newMarker);
    }
  
    this.polylineOptions.path = this.markerPositions;
  }

  switchMode(mode: 'PointA' | 'PointB'): void {
    this.currentMode = mode;
  }
}
