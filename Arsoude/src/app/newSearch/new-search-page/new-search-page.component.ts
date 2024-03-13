import { style } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { latLng, LatLng, tileLayer, TileLayerOptions, Layer } from 'leaflet';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';
import { FilterDTO } from 'src/app/models/FilterDTO';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailType } from 'src/app/models/enum/Type';
import { TrailService } from 'src/app/service/trail.service';
@Component({
  selector: 'app-new-search-page',
  templateUrl: './new-search-page.component.html',
  styleUrls: ['./new-search-page.component.css']
})
export class NewSearchPageComponent{
  @ViewChild('mapContainerOptions') mapContainerOptions!: ElementRef;
  
  trails: TrailDTO[] = [];
  selectedType?: string;
  searchInput?: string;
  faAngleDown = faAngleDown;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;
  type : TrailType = TrailType.Undefined;
  radius : number = 0;
  minRadius : number = 10;
  rangeValue: number = 0;
  ratingVal: number = 0;
  trailOptionsVisible: boolean = false;


  emptyList : boolean = false;
  //pagination
  pagedTrails: TrailDTO[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  trailsLength: number = 0;
  layers: Layer[] = [];
	markers: {trailId: number, marker: L.Marker}[] = [];
  markersMap : Layer[] = [];

  //Map section 
  optionsSpec: any = {
    layers: [{ url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: 'Open Street Map' }],
    zoom: 2,
    center: [46.879966, -121.726909]
  };
  zoom = this.optionsSpec.zoom;
  center = latLng(this.optionsSpec.center);

  tileLayerOptions: TileLayerOptions = {
    attribution: this.optionsSpec.layers[0].attribution
  };

  southWest: L.LatLng = L.latLng(84.953827, -176.559498);
  northEast: L.LatLng = L.latLng(-84.295994, 180.559498);
  bounds: L.LatLngBounds = L.latLngBounds(this.southWest, this.northEast);

  currentLat: string = "";
  currentLng: string = "";


  options = {
    layers: [tileLayer(this.optionsSpec.layers[0].url, this.tileLayerOptions)],
    zoom: this.optionsSpec.zoom,
    center: latLng(this.optionsSpec.center),
    minZoom : 2,
    maxZoom : 140,
    maxBounds : this.bounds
  };

  optionsSecondMap = {
      layers: [L.tileLayer(this.optionsSpec.layers[0].url, { attribution: this.optionsSpec.layers[0].attribution })],
      zoom: this.optionsSpec.zoom,
      center: L.latLng(this.optionsSpec.center),
      minZoom : 2,
      maxZoom : 140,
      maxBounds : this.bounds
  }

  formZoom = this.zoom;
  zoomLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  lat = this.center.lat;
  lng = this.center.lng;

  constructor( private router: Router,private trailService : TrailService, private activedRoute: ActivatedRoute, private renderer: Renderer2){}
  

  async ngOnInit(){
    let param = this.activedRoute.snapshot.paramMap.get("keyword")

    let dto = new FilterDTO(param?.toString());

    if(param != null){
      this.trails = await this.trailService.searchTrails(dto);
      console.log(this.trails);
      this.trailsLength = this.trails.length;
      this.updatePagedTrail();
    } else {
      this.trails = await this.trailService.allTrails();
      this.trailsLength = this.trails.length;
      this.updatePagedTrail();
    }

    //make a foreach loop in trails 


    this.addMarkers(this.trails);
    this.renderer.removeClass(document.body, 'menu-open');
  }
  
  addMarkers(trails: TrailDTO[]){
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
      
      <div class="popup" (click)="getDetails(${trail.id})">
          <div class="imageContainer2">
            <img src="${trail.imageUrl}" alt="image_trail">
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
    
      

      newMarker.on('click', (event: L.LeafletEvent) => {
        // Display the information of the marker when clicked
        // For example, you can access the popup content like this:
        
      });
      newMarker.bindPopup(popupContent);
      this.markers.push({ trailId: trail.id!, marker: newMarker });
    });


    const markerLayers = this.markers.map(markerObj => markerObj.marker);
    this.markersMap = markerLayers;
    console.log(this.markers);
    console.log(this.markersMap);
    console.log(this.trails);
  }

  displayTrailMarker(trail: TrailDTO) {
    
      for (let i = 0; i < this.markers.length; i++) {
        if (this.markers[i].trailId === trail.id) {
          this.markers[i].marker.openPopup();
        }
      }
      // Find the marker associated with the given trail ID
    
  }


  updatePagedTrail(){
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedTrails = this.trails.slice(startIndex, endIndex);
  }

  onPageChange(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagedTrail();
  }


  async Search(){
    this.markers = [];
    let dto = new FilterDTO();

    if(this.type != TrailType.Undefined){
      dto.type = parseInt(this.type.toString());
    }

    if(this.radius != 0){
      dto.distance = this.radius;
    }

    if(this.searchInput?.trim() != ""){
      dto.Keyword = this.searchInput;
    }

    if(await this.trailService.searchTrails(dto) == "NoHikesFound"){
      this.emptyList = true;
    }
    else{
      this.trails = await this.trailService.searchTrails(dto);
      this.addMarkers(this.trails);
      this.emptyList = false;
      this.trailsLength = this.trails.length;
      this.updatePagedTrail();
    }
  }

  onEnter() {

  }

  async getDetails(trailId:number){
    try{
      localStorage.setItem("trailid", trailId.toString());
      console.log(trailId);
      var x = await this.trailService.getTrailDetails(trailId);
      this.router.navigate(['/details', x.name]);

    }
    catch(e){
      console.log("Erreur : " + e);
    }
  }

  toggleColor(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    const containers = document.querySelectorAll('.containerFirstIcon, .containerSecondIcon');
    containers.forEach(function(container) {
        container.classList.remove('backgroundColor');
    });
    element.classList.add('backgroundColor');
  } 



  

  onCenterChange(center: LatLng) {
    setTimeout(() => {
      this.lat = center.lat;
      this.lng = center.lng;
    });
  }

  onZoomChange(zoom: number) {
    setTimeout(() => {
      this.formZoom = zoom;
    });
  }

  doApply() {
    this.center = latLng(this.lat, this.lng);
    this.zoom = this.formZoom;
  }

  closeMenu(): void {
    this.trailOptionsVisible = false;
    if(this.trailOptionsVisible == false){
      this.renderer.removeClass(document.body, 'menu-open');
    }
  }

  openMenu(): void {
    
    this.trailOptionsVisible = true;
    // Get the current position using geolocation service
    if(this.trailOptionsVisible){
      this.renderer.addClass(document.body, 'menu-open');
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter = L.latLng(latitude, longitude);

        this.center = newCenter;
        this.zoom = 14
       
        if (this.mapContainerOptions && this.mapContainerOptions.nativeElement) {
          

          // Create and add circle layer to the map
          const circle = L.circle([latitude, longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: this.metersToKilometers(0)
          });


          this.layers.push(circle);
          console.log(this.layers);

        } else {
          console.error('Leaflet map container element not found.');
        }

        
      },
      (error) => {
        console.error('Error getting current position:', error);
      }
    );
  }

  centerMap(latitude: number, longitude: number) {
    this.optionsSecondMap.center = L.latLng(latitude, longitude);
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resp => {
          resolve(resp);
        },
        err => {
          console.error('Error getting current position:', err);
          reject(err);
        }
      );
    });
  }

  onRangeChange(event: Event) {
    // Handle range value change logic here
    console.log('Range value:', this.rangeValue);
    const circle = this.layers[0] as L.Circle;
      // Set the radius directly to the new range value
      const newRadius = this.metersToKilometers(this.rangeValue); // Convert range value to meters

      if(this.rangeValue <= 3){
        this.zoom = 12;
      } else if(this.rangeValue <= 10){
        this.zoom = 10;
      } else if(this.rangeValue <= 15){
        this.zoom = 9;
      } else if(this.rangeValue <= 20){
        this.zoom = 9;
      } else if(this.rangeValue <= 25){
        this.zoom = 8;
      } else if(this.rangeValue <= 30){
        this.zoom = 8;
      } else if(this.rangeValue <= 35){
        this.zoom = 8;
      } else if(this.rangeValue <= 40){
        this.zoom = 8;
      } else if(this.rangeValue <= 45){
        this.zoom = 8;
      } else if(this.rangeValue <= 50 || this.rangeValue >= 50){
        this.zoom = 7;
      }
      //get the current position using the function getPosition
      this.getPosition().then(position => {
        const { latitude, longitude } = position.coords;
        const newCenter = L.latLng(latitude, longitude);
        this.center = newCenter;
      });
      circle.setRadius(newRadius);
  }

   metersToKilometers(radiusInMeters: number): number {
    return radiusInMeters * 1000; // Convert meters to kilometers
  }

  handleStarClick(event: any): void {
    this.ratingVal = event.detail;
    console.log(this.ratingVal)
    // You can perform any additional logic here based on the clicked star value
  }

  

}
