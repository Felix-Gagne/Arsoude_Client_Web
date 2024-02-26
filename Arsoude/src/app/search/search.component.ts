import { Component, ViewChild } from '@angular/core';
import { TrailDTO } from '../models/TrailDTO';
import { faPersonWalking, faBicycle, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { TrailService } from '../service/trail.service';
import { FilterDTO } from '../models/FilterDTO';
import { TrailType } from '../models/enum/Type';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
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

  updatePagedTrail(){
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedTrails = this.trails.slice(startIndex, endIndex);
    console.log(this.pagedTrails)
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

}
