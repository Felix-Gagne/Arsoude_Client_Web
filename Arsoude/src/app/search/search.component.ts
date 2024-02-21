import { Component } from '@angular/core';
import { TrailDTO } from '../models/TrailDTO';
import { faPersonWalking, faBicycle, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { TrailService } from '../service/trail.service';
import { FilterDTO } from '../models/FilterDTO';
import { TrailType } from '../models/enum/Type';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor( private router: Router,private trailService : TrailService, private activedRoute: ActivatedRoute){}

  async ngOnInit(){
    let param = this.activedRoute.snapshot.paramMap.get("keyword")

    let dto = new FilterDTO(param?.toString());

    if(param != null){
      this.trails = await this.trailService.searchTrails(dto);
      console.log(this.trails);
    } else {
      this.trails = await this.trailService.allTrails();
    }
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
