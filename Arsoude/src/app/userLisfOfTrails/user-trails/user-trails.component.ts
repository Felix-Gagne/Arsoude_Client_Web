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

  constructor(public trailService : TrailService, private router: Router){}

  async ngOnInit(){
    var response = await this.trailService.GetUserTrails();
    this.userTrails = response;    
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
