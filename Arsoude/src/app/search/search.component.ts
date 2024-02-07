import { Component } from '@angular/core';
import { TrailDTO } from '../models/TrailDTO';
import { faPersonWalking, faBicycle, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { TrailService } from '../service/trail.service';
import { FilterDTO } from '../models/FilterDTO';

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
  type : number = 2;
  radius : number = 0;

  constructor(private trailService : TrailService){}

  async ngOnInit(){
    let data = localStorage.getItem("Search");

    if(data != null){
      this.trails = await this.trailService.searchTrails(JSON.parse(data));
      console.log(this.trails);
    }
  }

  async Search(){
    let dto = new FilterDTO();

    if(this.type != 2){
      dto.type = this.type;
    }

    dto.distance = this.radius;

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
}
