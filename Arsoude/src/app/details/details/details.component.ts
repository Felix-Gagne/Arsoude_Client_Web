import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailService } from 'src/app/service/trail.service';
import { faPersonWalking, faBicycle, faBookmark, } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/service/user.service';

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

  constructor( private router: Router,private trailService : TrailService, public userService: UserService){}

  async ngOnInit(){
    var data = localStorage.getItem("trailid");
    if(data != null){
      this.trail = await this.trailService.getTrailDetails(parseInt(data));
    }
    console.log(this.trail)
    
    this.Favorites = await this.trailService.getFavTrails();
    console.log(this.Favorites.includes(this.trail!))
    for(let i =0; i < this.Favorites.length; i ++){
    if(this.Favorites[i].id == this.trail?.id){

      this.isFavorite= true;
    }

    }
console.log(this.isFavorite);
    const startMarker: google.maps.LatLngLiteral = { 
      lat: this.trail?.startingCoordinates!.latitude!, 
      lng: this.trail?.startingCoordinates!.longitude! 
    };

    const endMarker: google.maps.LatLngLiteral = {
      lat: this.trail?.endingCoordinates!.latitude!, 
      lng: this.trail?.endingCoordinates!.longitude! 
    };
    
    this.markerPositions.push(startMarker, endMarker);

  }

  async addToFavorite(){
    this.isFavorite = !this.isFavorite;
    console.log(this.isFavorite)
    await this.trailService.manageTrailFavorite(this.trail?.id!, this.isFavorite);
  }

}
