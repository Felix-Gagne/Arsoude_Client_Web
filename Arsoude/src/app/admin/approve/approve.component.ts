import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBicycle, faPersonWalking, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { AdminService } from 'src/app/service/admin.service';
import { TrailService } from 'src/app/service/trail.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  trails: TrailDTO[] = [];
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;
  faTrash = faTrash;


  constructor(public service : AdminService, public trailService : TrailService, public router : Router){



  }
  ngOnInit(): void {
     this.Refresh()



  }
 async Refresh() : Promise<void> {
 this.trails = await this.service.GetWork()
 }
 
 async approve(trail : TrailDTO){
        await this.service.SetStatus(true, trail.id!)
        this.Refresh()
 }
 async refuse(trail : TrailDTO){
 await this.service.SetStatus(false, trail.id!)
     this.Refresh()
}
async Delete(trail : TrailDTO){
  await this.service.DeleteTrail(trail.id!)
      this.Refresh()
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
