import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailService } from 'src/app/service/trail.service';

@Component({
  selector: 'app-user-trails',
  templateUrl: './user-trails.component.html',
  styleUrls: ['./user-trails.component.css']
})
export class UserTrailsComponent {

  userTrails : TrailDTO[] = [];
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(public trailService : TrailService, private router: Router){}

  async ngOnInit(){
    var response = await this.trailService.GetUserTrails();
    this.userTrails = response;   
    
    this.sortUserTrails();
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

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortUserTrails();
  }

  sortUserTrails() {
    const multiplier = this.sortOrder === 'asc' ? 1 : -1;

    this.userTrails.sort((a, b) => {
      return multiplier * (new Date(a.creationDate!).getTime() - new Date(b.creationDate!).getTime());
    });
  }
  
  changeDateOrder(){
    var icon = document.getElementById("chevron-icon");
    console.log(icon);
    if(icon != null){
      if(icon.style.transform == "rotate(0deg)" || icon.style.transform == ""){
        console.log("rotate 180")
        icon.style.transform = "rotate(180deg)";
      }
      else{
        console.log("rotate 0")
        icon.style.transform = "rotate(0deg)";
      }
      this.toggleSortOrder();
    }
  }

}
