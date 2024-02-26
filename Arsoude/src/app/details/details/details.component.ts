import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailService } from 'src/app/service/trail.service';
import { faPersonWalking, faBicycle, faBookmark, } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/service/user.service';
import { CommentDTO } from 'src/app/models/CommentDTO';
import { CommentsService } from 'src/app/service/comments.service';
import { Comments } from 'src/app/models/Comments';
import { NotifierService } from 'src/app/notifier.service';
import { TranslateService } from '@ngx-translate/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  
  trail : TrailDTO | undefined;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;
  faBookMark = faBookmark
  center: google.maps.LatLngLiteral = { lat: 45.53784, lng: -73.49244 };
  zoom = 13;
  mapTypeId = google.maps.MapTypeId.SATELLITE;
  markerPositions: google.maps.LatLngLiteral[] = [];
  isFavorite : boolean = false;
  Favorites : TrailDTO[] = []
  isOwner = false;
  commentList : Comments[] = [];
  commentInput? : string;
  isUndefined : boolean = false;

  @ViewChild('googlemaps') map!: GoogleMap;


  constructor( private router: Router,private trailService : TrailService, public userService: UserService, 
    public commentService : CommentsService, public notifierService : NotifierService, public translate : TranslateService){}

  async ngOnInit(){

    if(this.trail?.imageUrl == undefined)
    {
      this.isUndefined = true;
    }

    var data = localStorage.getItem("trailid");
    if(data != null){
      this.trail = await this.trailService.getTrailDetails(parseInt(data));
    }

    this.checkOwnerByTrailId()
    this.Favorites = await this.trailService.getFavTrails();

    for(let i = 0; i < this.Favorites.length; i ++){
      if(this.Favorites[i].id == this.trail?.id){
        this.isFavorite= true;
      }
    }

    const startMarker: google.maps.LatLngLiteral = { 
      lat: this.trail?.startingCoordinates!.latitude!, 
      lng: this.trail?.startingCoordinates!.longitude! 
    };

    const endMarker: google.maps.LatLngLiteral = {
      lat: this.trail?.endingCoordinates!.latitude!, 
      lng: this.trail?.endingCoordinates!.longitude! 
    };
    
    this.markerPositions.push(startMarker, endMarker);


    if(this.trail?.id != undefined){
      this.commentList = await this.commentService.getComments(this.trail?.id)
    }

    let bounds = new google.maps.LatLngBounds()
    for (let marker of this.markerPositions) {
      // On agrandi les limites avec nos coordonnées
      bounds.extend(marker);
    }
    // On ajuste la carte aux limites
    // Le center et le niveau de zoom sont assignés automatiquement
    this.map!.fitBounds(bounds);

  }



  async addToFavorite(){
    this.isFavorite = !this.isFavorite;
    console.log(this.isFavorite)
    await this.trailService.manageTrailFavorite(this.trail?.id!, this.isFavorite);
  }

  async checkOwnerByTrailId(){
    let x =await this.trailService.checkOwnerByTrailId(this.trail?.id!);
    this.isOwner = x;
  }

  async makePublic(){
    let x = await this.trailService.SetVisibility(this.trail!.id!, true)
    this.trail!.isPublic = true
  }

  async sendComments(){
    if(this.commentInput != null && this.trail?.id != undefined){
      let dto = new CommentDTO(this.commentInput, this.trail?.id);
      await this.commentService.sendComment(dto);

      this.notifierService.showNotification( this.translate.instant('commentNotification'), "success")

      this.refreshPage();
    }
  }

  async makePrivate(){
    let x = await this.trailService.SetVisibility(this.trail!.id!, false)
    this.trail!.isPublic = false
  }

  refreshPage() {
    window.location.reload();
  }

}
