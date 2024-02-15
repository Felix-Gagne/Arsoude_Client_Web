import { Component } from '@angular/core';
import { TrailDTO } from '../models/TrailDTO';
import { faPersonWalking, faBicycle, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { TrailService } from '../service/trail.service';
import { FilterDTO } from '../models/FilterDTO';
import { TrailType } from '../models/enum/Type';
import { Router } from '@angular/router';

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

  constructor( private router: Router,private trailService : TrailService){}

  async ngOnInit(){
    let data = localStorage.getItem("Search");

    if(data != null){
      this.trails = await this.trailService.searchTrails(JSON.parse(data));
      console.log(this.trails);
    }
  }

  async Search(){
    let dto = new FilterDTO();

    if(this.type != TrailType.Undefined){
      dto.type = parseInt(this.type.toString());
    }

    if(this.radius >= 10){
      dto.distance = this.radius;
    }

    if(this.searchInput?.trim() != ""){
      dto.Keyword = this.searchInput;
    }

    try{
      this.trails = await this.trailService.searchTrails(dto);
    }
    catch(e){
      console.log("Erreur : " + e);
    }

    console.log(dto);
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
