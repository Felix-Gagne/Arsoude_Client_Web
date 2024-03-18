import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { Comments } from 'src/app/models/Comments';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { CommentsService } from 'src/app/service/comments.service';
import { TrailService } from 'src/app/service/trail.service';

@Component({
  selector: 'app-search-page-detail',
  templateUrl: './search-page-detail.component.html',
  styleUrls: ['./search-page-detail.component.css']
})
export class SearchPageDetailComponent {

  constructor(private route: ActivatedRoute, public trailService: TrailService, public commentService: CommentsService, private router:Router) { }
  
  trailId !: number;
  trail !: TrailDTO;

  faAngleDown = faAngleDown;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;

  commentList: Comments[] = [];
  noComment: boolean = false;

  hasImage: boolean = false;

  async ngOnInit(){
    this.route.params.subscribe(params => {
      this.trailId = params['id'];
    });

    this.trail = await this.trailService.getTrailDetails(this.trailId);
    console.log(this.trail);

    if(this.trail != null && this.trail != undefined){
      this.commentList = await this.commentService.getComments(this.trail.id!);
      console.log(this.commentList);

      if(this.commentList.length == 0){
        this.noComment = true;
      }

      if(this.trail.imageUrl != ""){
        this.hasImage = true;
      }
      else{
        this.hasImage = false;
      }
    }
  }

  back(){
    this.router.navigate(['']);
  }
}
