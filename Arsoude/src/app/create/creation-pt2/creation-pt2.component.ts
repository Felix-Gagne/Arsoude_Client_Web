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
  center: google.maps.LatLngLiteral = { lat: 42, lng: -4 };
  zoom = 5;

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
    if (this.currentMode === 'PointA') {
      this.latitudeA = event.latLng!.lat();
      this.longitudeA = event.latLng!.lng();
      console.log('Point A set');
    } else if (this.currentMode === 'PointB') {
      this.latitudeB = event.latLng!.lat();
      this.longitudeB = event.latLng!.lng();
      console.log('Point B set');
    }
  }

  switchMode(mode: 'PointA' | 'PointB'): void {
    this.currentMode = mode;
  }
}
