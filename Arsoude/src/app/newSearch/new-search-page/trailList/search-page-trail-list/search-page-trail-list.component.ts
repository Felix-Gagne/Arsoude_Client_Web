import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { LatLng, Layer, TileLayerOptions, latLng, tileLayer } from 'leaflet';
import { FilterDTO } from 'src/app/models/FilterDTO';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailType } from 'src/app/models/enum/Type';
import { MapService } from 'src/app/service/map.service';
import { TrailService } from 'src/app/service/trail.service';

@Component({
  selector: 'app-search-page-trail-list',
  templateUrl: './search-page-trail-list.component.html',
  styleUrls: ['./search-page-trail-list.component.css']
})
export class SearchPageTrailListComponent {
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

  trailExists: boolean = false;

  constructor( private router: Router,public trailService : TrailService, private activedRoute: ActivatedRoute, private renderer: Renderer2, public mapService : MapService){}
  

  async ngOnInit(){
    let param = this.activedRoute.snapshot.paramMap.get("keyword")
    this.trailService.trailSearch = false;

    let dto = new FilterDTO(param?.toString());

    if(param != null){
      this.trails = await this.trailService.searchTrails(dto);
      this.trailsLength = this.trails.length;
      this.trailService.updatePagedTrail(this.currentPage, this.pageSize);
    } else {
      this.trails = await this.trailService.allTrails();
      this.trailsLength = this.trails.length;
      this.trailService.updatePagedTrail(this.currentPage, this.pageSize);
    }

    this.trailExists = this.trailService.trailExist;
    this.renderer.removeClass(document.body, 'menu-open');
  }
  

  onPageChange(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.trailService.updatePagedTrail(this.currentPage, this.pageSize);
  }

  onEnter() {

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

}
