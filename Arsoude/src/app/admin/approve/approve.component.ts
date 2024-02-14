import { Component, OnInit } from '@angular/core';
import { faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  trails: TrailDTO[] = [];
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;


  constructor(public service : AdminService){



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

   
}
