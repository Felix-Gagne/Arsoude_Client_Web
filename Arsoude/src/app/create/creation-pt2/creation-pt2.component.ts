import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Coordinates } from 'src/app/models/Coordinates';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailService } from 'src/app/service/trail.service';

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
  markerA?: google.maps.LatLngLiteral;
  markerB?: google.maps.LatLngLiteral;
  currentMode: 'PointA' | 'PointB' | 'Disabled' = 'PointA';
  center: google.maps.LatLngLiteral = { lat: 45.53784, lng: -73.49244 };
  zoom = 15;
  mapTypeId = google.maps.MapTypeId.SATELLITE;
  disableConfirmerButton = true;
  titleChoice: "creationPt2.titleChoice1" | "creationPt2.titleChoice2" | "creationPt2.titleChoice3" = "creationPt2.titleChoice1";
  disableBtnPointA = false;
  disableBtnPointB = true;

  trail : TrailDTO | undefined;

  constructor(public router : Router, public service : TrailService){}

  ngOnInit(): void{
    let data = localStorage.getItem("createTrail");
    if(data != null){
      this.trail = JSON.parse(data);
    }
    console.log(this.trail);
  }

  markerPositions: google.maps.LatLngLiteral[] = [ ];

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
    
    if(this.currentMode === 'Disabled') {
      return;
    } else if (this.currentMode === 'PointA') {
      this.latitudeA = newMarker.lat;
      this.longitudeA = newMarker.lng;
      this.markerA = newMarker;
      console.log('marker A');
      this.currentMode = 'PointB';
      this.disableBtnPointA = true;
      this.disableBtnPointB = false;
      this.switchTitle("creationPt2.titleChoice2");
    } else if (this.currentMode === 'PointB') {
      this.latitudeB = newMarker.lat;
      this.longitudeB = newMarker.lng;
      this.markerB = newMarker;
      console.log('marker B');
      this.disableBtnPointA = true;
      this.disableBtnPointB = true;
      this.switchTitle("creationPt2.titleChoice3");
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


    console.log(this.markerPositions.length);
    //Vérifie si l'utilisateur a bien placé les deux points
    if (this.markerPositions.length === 2) {
      this.disableConfirmerButton = false;
      this.currentMode = 'Disabled';
    } else {
      this.disableConfirmerButton = true;
    }
  }

  switchMode(mode: 'PointA' | 'PointB' | 'Disabled'): void {
    this.currentMode = mode;
  }

  async CreateTrail(){
    const StartingPoint = new Coordinates(this.latitudeA, this.longitudeA);
    const EndingPoint = new Coordinates(this.latitudeB, this.longitudeB);
    this.trail!.startingCoordinates = StartingPoint;
    this.trail!.endingCoordinates = EndingPoint;

    console.log(this.trail);

    try{
      console.log(this.trail);
      if(this.trail != undefined){
        this.service.CreateTrail(this.trail);
      }
      
      this.router.navigate(['']);
    }
    catch(e){
      console.log("Erreur : " + e);
    }
  }

  switchTitle(mode: "creationPt2.titleChoice1" | "creationPt2.titleChoice2" | "creationPt2.titleChoice3"): void {
    this.titleChoice = mode;
  }

  resetPoints(){
    this.markerPositions = [];
    this.markerA = undefined;
    this.markerB = undefined;
    this.latitudeA = undefined;
    this.longitudeA = undefined;
    this.latitudeB = undefined;
    this.longitudeB = undefined;
    this.disableConfirmerButton = true;
    this.currentMode = 'PointA';
    this.disableBtnPointA = false;
    this.disableBtnPointB = true;
    this.switchTitle("creationPt2.titleChoice1");
  }
}
