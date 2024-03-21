import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { LatLng, Layer, PolylineOptions, TileLayerOptions, latLng, tileLayer } from 'leaflet';
import { Coordinate } from 'mapbox-gl';
import { Comments } from 'src/app/models/Comments';
import { Coordinates } from 'src/app/models/Coordinates';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { CommentsService } from 'src/app/service/comments.service';
import { TrailService } from 'src/app/service/trail.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-search-page-detail',
  templateUrl: './search-page-detail.component.html',
  styleUrls: ['./search-page-detail.component.css'],  
})
export class SearchPageDetailComponent {

  constructor(private route: ActivatedRoute, public trailService: TrailService, public commentService: CommentsService, private router:Router) { }
  
  trailId !: number;
  trail !: TrailDTO;
  photoList: string[] = [];
  scrollPosition = '0';
  triggerAnimationFlag: boolean = false;
  animateCarousel: boolean = true;
  imagesExist: boolean = false;

  faAngleDown = faAngleDown;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;

  commentList: Comments[] = [];
  noComment: boolean = false;

  hasImage: boolean = false;

  optionsSpec: any = {
    layers: [{ url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: 'Open Street Map' }],
    zoom: 2,
    center: [46.879966, -121.726909]
  };
  zoom = this.optionsSpec.zoom;
  center = latLng(this.optionsSpec.center);
  layers: Layer[] = [];

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
  coordinatesList: Coordinates[] = []; 


  async ngOnInit(){
    this.route.params.subscribe(params => {
      this.trailId = params['id'];
    });

    this.trail = await this.trailService.getTrailDetails(this.trailId);
    console.log(this.trail.coordinates);

    if(this.trail != null && this.trail != undefined){
      this.commentList = await this.commentService.getComments(this.trail.id!);
      console.log(this.commentList);

      if(this.commentList.length == 0){
        this.noComment = true;
      }

      if(this.trail.imageUrl != ""){
        this.hasImage = true;
      }
      else{
        this.hasImage = false;
      }

      if(this.trail.coordinates != null && this.trail.coordinates != undefined){
        this.coordinatesList = this.trail.coordinates;
        this.drawLines();
      }
      
      this.photoList = await this.trailService.getPhotos(this.trail.id!);
      if(this.photoList.length != 0){
        this.imagesExist = true;
      }
      this.initializeOptionsSpec();
    }

    
  }


  initializeOptionsSpec() {
    this.optionsSpec = {
      layers: [{ url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: 'Open Street Map' }],
      zoom: 13,
      center: [this.trail.startingCoordinates!.latitude, this.trail.startingCoordinates!.longitude]
    };
    this.zoom = this.optionsSpec.zoom;
    this.center = latLng(this.optionsSpec.center);
    this.tileLayerOptions = {
      attribution: this.optionsSpec.layers[0].attribution
    };
    this.southWest = L.latLng(84.953827, -176.559498);
    this.northEast = L.latLng(-84.295994, 180.559498);
    this.bounds = L.latLngBounds(this.southWest, this.northEast);
    this.options = {
      layers: [tileLayer(this.optionsSpec.layers[0].url, this.tileLayerOptions)],
      zoom: this.optionsSpec.zoom,
      center: latLng(this.optionsSpec.center),
      minZoom : 2,
      maxZoom : 140,
      maxBounds : this.bounds
    };
    this.formZoom = this.zoom;
    this.lat = this.center.lat;
    this.lng = this.center.lng;
  }

  back(){
    this.router.navigate(['']);
  }


  drawLines() {
    console.log(this.coordinatesList);
    this.coordinatesList.sort((a, b) => a.id! - b.id!);

    const latLngs: LatLng[] = [];
    for (const coordinate of this.coordinatesList) {
      if (coordinate.latitude !== undefined && coordinate.longitude !== undefined) {
        latLngs.push(latLng(coordinate.latitude, coordinate.longitude));
      }
    }
  
    const polylineOptions: PolylineOptions = {
      color: 'blue', // Change color as desired
      weight: 3, // Change weight as desired
      opacity: 0.5, // Change opacity as desired
    };
  
    const polyline = L.polyline(latLngs, polylineOptions);
    this.layers.push(polyline);
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

  triggerAnimation() {
    this.triggerAnimationFlag = true;
    setTimeout(() => {
      this.triggerAnimationFlag = false;
    }, 600);
  }

  next(){
    console.log("next");
    const firstImage = this.photoList.shift();
    this.photoList.push(firstImage!);
    const carouselContainer = document.querySelector('.carousselContainer');
    const images = carouselContainer!.querySelectorAll('img');
    const imageWidth = images[0].clientWidth; 
    const newPosition = -32; 
    images.forEach(image => {
      image.style.transition = 'none'; 
      image.style.transform = `translateX(0)`; 
      
      setTimeout(() => {
          image.style.transition = 'transform 0.8s ease'; 
          image.style.transform = `translateX(${newPosition}vh)`; 
      }, 50); 
  });
  }

  backImage(){
    console.log("back");
    const lastImage = this.photoList.pop();
    this.photoList.unshift(lastImage!);
    const carouselContainer = document.querySelector('.carousselContainer');
    const images = carouselContainer!.querySelectorAll('img');
    const newPosition = 0;

    images.forEach(image => {
        image.style.transition = 'none'; 
        image.style.transform = `translateX(calc(-100% - 20px))`; 
        
        setTimeout(() => {
            image.style.transition = 'transform 0.8s ease'; 
            image.style.transform = `translateX(${newPosition}vh)`; 
        }, 50); // Adjust delay as needed
    });
  }

  
}
