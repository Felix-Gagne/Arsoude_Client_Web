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
import { MapService } from 'src/app/service/map.service';
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

  constructor( private router: Router,private trailService : TrailService, private activedRoute: ActivatedRoute, private renderer: Renderer2, public mapService : MapService){}
  

  async ngOnInit(){
    let param = this.activedRoute.snapshot.paramMap.get("keyword")

    let dto = new FilterDTO(param?.toString());

    if(param != null){
      this.trails = await this.trailService.searchTrails(dto);
      console.log(this.trails);
      this.trailsLength = this.trails.length;
      this.trailService.updatePagedTrail(this.currentPage, this.pageSize);
    } else {
      this.trails = await this.trailService.allTrails();
      this.trailsLength = this.trails.length;
      this.trailService.updatePagedTrail(this.currentPage, this.pageSize);
    }

    //make a foreach loop in trails 
    if(this.mapService.center == null && this.mapService.zoom == null && this.mapService.center == undefined && this.mapService.zoom == undefined){
      this.mapService.center = this.center;
      this.mapService.zoom = this.zoom;
    }
   

    this.addMarkers(this.trails);
    this.renderer.removeClass(document.body, 'menu-open');
  }
  
  addMarkers(trails: TrailDTO[]){
    this.mapService.addMarkers(trails);
    const markerLayers = this.mapService.markers.map(markerObj => markerObj.marker);
    this.markersMap = markerLayers;
  }

  displayTrailMarker(trail: TrailDTO) {
      for (let i = 0; i < this.markers.length; i++) {
        if (this.markers[i].trailId === trail.id) {
          const marker = this.markers[i].marker;
          marker.setIcon(L.icon({
            iconUrl: 'red_marker_icon_url.png',
            iconSize: [25, 41],
            iconAnchor: [13, 41],
          }));          
        }
      }    
  }

  hideTrailMarker(trail: TrailDTO) {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].trailId === trail.id) {
        this.markers[i].marker.closePopup();
      }
    }
  }




  async Search(){
    let dto = new FilterDTO();

    if(this.type != TrailType.Undefined){
      dto.type = parseInt(this.type.toString());
    }

    if(this.radius != null && this.radius != undefined){
      dto.distance = this.radius;
    }
    

    if(this.searchInput?.trim() != ""){
      dto.Keyword = this.searchInput;
    }
    
    if(await this.trailService.searchTrails(dto) == false){
      this.emptyList = true;
      this.mapService.markersMap = [];
      //this.router.navigate(['/newSearch/home']);
    }
    else{
      this.trails = await this.trailService.searchTrails(dto);
      this.addMarkers(this.trails);
      this.emptyList = false;
      this.trailsLength = this.trails.length;
      this.trailService.updatePagedTrail(this.currentPage, this.pageSize);
      this.router.navigate(['/newSearch/home']);
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
    if(element.classList.contains('backgroundColor')) {
      containers.forEach(function(container) {
        container.classList.remove('backgroundColor');
    });
    this.type = TrailType.Undefined;
    }
    else{
      containers.forEach(function(container) {
        container.classList.remove('backgroundColor');
    });
    element.classList.add('backgroundColor');

    if(element.classList.contains('containerFirstIcon')){
      this.type = TrailType.Pied;
    }
    else{
      this.type = TrailType.Velo;
    }
    
  } 
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

      this.radius = this.rangeValue;
  }

   metersToKilometers(radiusInMeters: number): number {
    return radiusInMeters * 1000; // Convert meters to kilometers
  }

  handleStarClick(event: any): void {
    this.ratingVal = event.detail;
    console.log(this.ratingVal)
    // You can perform any additional logic here based on the clicked star value
  }

  applyFilterAndCloseMenu(): void {
    this.Search();
    this.closeMenu();
  }

  //make a function that will zoom on the marker and center the map on it     
  




  

}

