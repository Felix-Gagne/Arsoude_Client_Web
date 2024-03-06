import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { latLng, LatLng, tileLayer, TileLayerOptions } from 'leaflet';
import { FilterDTO } from 'src/app/models/FilterDTO';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailType } from 'src/app/models/enum/Type';
import { TrailService } from 'src/app/service/trail.service';

@Component({
  selector: 'app-new-search-page',
  templateUrl: './new-search-page.component.html',
  styleUrls: ['./new-search-page.component.css']
})
export class NewSearchPageComponent {
  

  trails: TrailDTO[] = [];
  selectedType?: string;
  searchInput?: string;
  faAngleDown = faAngleDown;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;
  type : TrailType = TrailType.Undefined;
  radius : number = 0;
  minRadius : number = 10;

  emptyList : boolean = false;

  //pagination
  pagedTrails: TrailDTO[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  trailsLength: number = 0;

  constructor( private router: Router,private trailService : TrailService, private activedRoute: ActivatedRoute){}

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
  }

  optionsSpec: any = {
    layers: [{ url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: 'Open Street Map' }],
    zoom: 5,
    center: [46.879966, -121.726909]
  };

  zoom = this.optionsSpec.zoom;
  center = latLng(this.optionsSpec.center);

  tileLayerOptions: TileLayerOptions = {
    attribution: this.optionsSpec.layers[0].attribution
  };

  options = {
    layers: [tileLayer(this.optionsSpec.layers[0].url, this.tileLayerOptions)],
    zoom: this.optionsSpec.zoom,
    center: latLng(this.optionsSpec.center)
  };

  formZoom = this.zoom;
  zoomLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  lat = this.center.lat;
  lng = this.center.lng;

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
      var x = await this.trailService.getTrailDetails(trailId);
      this.router.navigate(['/details', x.name]);

    }
    catch(e){
      console.log("Erreur : " + e);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
       this.loadMoreData();
    }
  }

  async loadMoreData() {
    let param = this.activedRoute.snapshot.paramMap.get("keyword");
  
    let dto = new FilterDTO(param?.toString());
  
    if (param != null) {
      const moreTrails = await this.trailService.searchTrails(dto);
      this.trails = this.trails.concat(moreTrails);
      this.trailsLength = this.trails.length;
      this.updatePagedTrail();
    } else {
      const moreTrails = await this.trailService.allTrails();
      this.trails = this.trails.concat(moreTrails);
      this.trailsLength = this.trails.length;
      this.updatePagedTrail();
    }
  }

}
