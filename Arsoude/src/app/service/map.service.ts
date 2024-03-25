import { Injectable } from '@angular/core';
import { TrailDTO } from '../models/TrailDTO';
import * as L from 'leaflet';
import { NewSearchPageComponent } from '../newSearch/new-search-page/new-search-page.component';
import { Layer } from 'leaflet';
import { TrailService } from './trail.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  markers: {trailId: number, marker: L.Marker}[] = [];
  markersMap : Layer[] = [];
  
  constructor(private trailService : TrailService, private router : Router) { }


  addMarkers(trails: TrailDTO[]){
    this.markers = [];
    this.markersMap = [];
    if(trails.length != 0){
      trails.forEach(trail => {
        var latitude = trail.startingCoordinates?.latitude;
        var longitude = trail.startingCoordinates?.longitude;
  
        const newMarker = L.marker(
          [latitude!, longitude!],
          {
            icon: L.icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'assets/leaflet/marker-icon.png',
              iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
              shadowUrl: 'assets/leaflet/marker-shadow.png',
            }),
          }
        );
  
        
  
        const popupContent = 
        `
        <style>
          .leaflet-popup{
            width: 300px !important;
            border-radius: 45px;
          }
  
          .leaflet-popup-content{
            width: 100% !important;
            margin: 0;
            border-radius: 45px;
  
          }
  
          .leaflet-popup-content-wrapper{
            width: 100% !important;
            padding: 0;
            border-radius: 15px;
  
          }
  
          .popup{
            display: flex;
            flex-direction: column;
            width: 300px;
            height: 250px;
            border-radius: 15px;
            overflow-y: auto; /* Add overflow-y property for vertical scrolling */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add box shadow for depth */
            cursor : pointer;
          }
  
          .imageContainer2{
            width: 100%;
            height: 60%;
            position: relative;
        }
        
        .imageContainer2>img{
          height: 100%;
          width: 100%;
          object-fit: cover;
            transition: 0.3s;
        }
  
        .icon2{
          position: absolute;
          margin: 15px;
          top: 0;
          right: 0;
          width: fit-content;
          height: fit-content;
          display: flex;
          align-items: center;
          background-color: white;
          width: 40px;
          height: 40px;
          justify-content: center;
          border-radius: 15%;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
          border: 1px solid #000;
      }
      
      
      .icon p{
          margin: 0;
          font-size: 22px;
          width: fit-content;
      }
  
          .trailImage2{
            height: 65%;
            width: 40%;
            object-fit: cover;
          }
  
          .trailTitleInformation2{
            margin-top: 10px;
            display: flex;
            margin-left: 15px;
          }
          
          .trailTitleInformation2 p{
              width: 65%;
              margin: 0;
              font-size: 16px;
          }
          
          .trailName2{
              font-weight: 570;
          }
          
          .rating2{
              display: flex;
              gap: 2px;
              height: fit-content;
          }
  
          .textLocation2{
            margin:0 !important;
            margin-left: 15px !important;
            margin-top: 5px !important;
            font-weight: 350;
            font-size: 16px;
        }
        
        .leaflet-popup-close-button{
          height: fit-content;
          width: fit-content;
          background-color: white !important;
          margin: 15px;
          border-radius: 90%;
          left:0 !important;
          transform : scale(1.2);
          transition: 0.3s;
        }
  
        .leaflet-popup-close-button:hover{
          background-color: #f0f0f0 !important;
        }
  
        .leaflet-popup-close-button span{
          font : 24px;
          color: black;
        }
        
        
  
        </style>
        
        <div class="popup"  id="popup-${trail.id}">
            <div class="imageContainer2">
            ${trail.imageUrl != '' ? 
            '<img src="'+trail.imageUrl+'" alt="image_trail" class="trailImage2">' : 
            '<img src="assets/images/imagePlaceholder.jpg" alt="pas d image" class="trailImage2">'}
            
              <div class="icon2">
                <p>${trail.type == 0 ? '<i class="fa-solid fa-person-walking"></i>' : '<i class="fa-solid fa-bicycle"></i>'}</p>
              </div>
            </div>
          <div class="trailTitleInformation2">
              <p class="trailName2">${trail.name}</p>
              <div class="rating2">
                <i class="fa-solid fa-star"></i>
                <p>4,88</p>
                <p>(500)</p>
              </div>
          </div>
          <p class="textLocation2">${trail.location}</p>
        </div>`;
      
        
  
        
        
       
        newMarker.bindPopup(popupContent);
        this.markers.push({ trailId: trail.id!, marker: newMarker });
  
  
        newMarker.on('mouseover', (event: L.LeafletEvent) => {
          // Display the information of the marker when hovered
          newMarker.openPopup();
        });
  
       
  
        newMarker.on('popupopen', () => {
          const popup = document.getElementById(`popup-${trail.id}`);
          if (popup) {
              popup.addEventListener('click', () => {
                  localStorage.setItem("trailid", trail.id!.toString());
                  console.log(trail.id!);
                  Promise.resolve(this.trailService.getTrailDetails(trail.id!))
                      .then(x => {
                        this.router.routeReuseStrategy.shouldReuseRoute = function () {
                          return false;
                      }
                      this.router.onSameUrlNavigation = 'reload';
                        this.router.navigate(['/detailResearch', trail.id!]);
                      })
                      .catch(e => {
                          console.log("Erreur : " + e);
                      });
              });
          }
      });
      });
  
      const markerLayers = this.markers.map(markerObj => markerObj.marker);
      this.markersMap = markerLayers;
    }
    
  }

  displayTrailMarker(trail: TrailDTO) {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].trailId === trail.id) {
        const marker = this.markers[i].marker;
        marker.openPopup();     
        //change marker color to black
        this.router.navigate(['/detailResearch', trail.id]);
        return;
      }
    }    
  }


  
  
}
