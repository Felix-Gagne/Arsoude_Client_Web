import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailService } from 'src/app/service/trail.service';

@Component({
  selector: 'app-search-page-detail',
  templateUrl: './search-page-detail.component.html',
  styleUrls: ['./search-page-detail.component.css']
})
export class SearchPageDetailComponent {

  constructor(private route: ActivatedRoute, public trailService: TrailService) { }
  
  trailId !: number;
  trail !: TrailDTO;

  async ngOnInit(){
    this.route.params.subscribe(params => {
      this.trailId = params['id'];
      // Now you have the trail name, you can fetch its information from your trail service
    });

    this.trail = await this.trailService.getTrailDetails(this.trailId);
    console.log(this.trail);
  }
}
