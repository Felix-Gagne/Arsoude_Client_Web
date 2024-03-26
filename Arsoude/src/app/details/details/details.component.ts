import { Component, ViewChild, inject } from '@angular/core';
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
import { AfterViewInit, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

declare var Masonry: any;
declare var imagesLoaded: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements AfterViewInit{

  @Input() images: string[] = [];
  @ViewChild('masongrid') masongrid: ElementRef | undefined;
  @ViewChildren('masongriditems') masongriditems: QueryList<any> | undefined;
  @ViewChild('addPhotoItem') addPhotoItem: ElementRef | undefined;
  private readonly storage: Storage = inject(Storage);

  trail: TrailDTO | undefined;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;
  faBookMark = faBookmark
  center: google.maps.LatLngLiteral = { lat: 45.53784, lng: -73.49244 };
  zoom = 13;
  mapTypeId = google.maps.MapTypeId.SATELLITE;
  markerPositions: google.maps.LatLngLiteral[] = [];
  isFavorite: boolean = false;
  Favorites: TrailDTO[] = []
  isOwner = false;
  commentList: Comments[] = [];
  commentInput?: string;
  isUndefined: boolean = false;
  photoList: string[] = [];
  temporaryPhotoList: string[] = [];

  uploadInProgress:boolean = false;
  Hasimage : boolean = false;
  imageUrl? : string = "";

  indexNbImages : number = 0;
  morePhotos : boolean = true;


  

  constructor(private router: Router, private trailService: TrailService, public userService: UserService,
    public commentService: CommentsService, public notifierService: NotifierService, public translate: TranslateService) { }

  async ngOnInit() {
    var data = localStorage.getItem("trailid");
    if (data != null) {
      this.trail = await this.trailService.getTrailDetails(parseInt(data));
    }

    if(this.userService.isConnected){
      this.checkOwnerByTrailId()
      this.Favorites = await this.trailService.getFavTrails();

      for (let i = 0; i < this.Favorites.length; i++) {
        if (this.Favorites[i].id == this.trail?.id) {
          this.isFavorite = true;
        }
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

    if (this.trail?.id != undefined) {
      this.commentList = await this.commentService.getComments(this.trail?.id)
      console.log(this.commentList)
      var photos = await this.trailService.getPhotos(this.trail.id!);
      this.temporaryPhotoList = photos;
      for(let i = 0; i < 11; i++){
        if(i < photos.length){
          this.photoList.push(photos[i])
          this.indexNbImages = i;
        }
    }
  }

  }

  ngAfterViewInit() {
    this.masongriditems!.changes.subscribe(e => {
      this.initMasonry();
    });

    // le ngFor est déjà fait
    if(this.masongriditems!.length > 0) {
      this.initMasonry();
    }
  }


  async addToFavorite() {
    this.isFavorite = !this.isFavorite;
    console.log(this.isFavorite)
    await this.trailService.manageTrailFavorite(this.trail?.id!, this.isFavorite);
  }

  async checkOwnerByTrailId() {
    let x = await this.trailService.checkOwnerByTrailId(this.trail?.id!);
    console.log(x);
    this.isOwner = x;
  }

  async makePublic() {
    let x = await this.trailService.SetVisibility(this.trail!.id!, true)
    console.log(x);
    this.trail!.isPublic = true
  }

  async sendComments() {
    if (this.commentInput != null && this.trail?.id != undefined) {
      let dto = new CommentDTO(this.commentInput, this.trail?.id);
      await this.commentService.sendComment(dto);

      this.notifierService.showNotification(this.translate.instant('commentNotification'), "success")

      this.refreshPage()
    }
  }

  async makePrivate() {
    let x = await this.trailService.SetVisibility(this.trail!.id!, false)
    console.log(x);
    this.trail!.isPublic = false
  }

  refreshPage() {
    window.location.reload();
  }

  initMasonry() {
    var grid = this.masongrid!.nativeElement;

    var msnry = new Masonry( grid, {
      itemSelector: '.grid-item',
      stagger: 30,
      columnWidth: 13
    });

    imagesLoaded( grid ).on( 'progress', function() {
      msnry.layout();
    });
  }


  async uploadFile(input: HTMLInputElement) {
    if (!input.files) return
    
    this.uploadInProgress = true;

    const files: FileList = input.files;
  
    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
            const storageRef = ref(this.storage, file.name);
            await uploadBytesResumable(storageRef, file);
            let test = await getDownloadURL(storageRef);
            this.Hasimage = true;
            this.imageUrl = test;
            await this.trailService.sendPhoto(this.trail!.id!, this.imageUrl);
            console.log(test);
            this.photoList  = await this.trailService.getPhotos(this.trail!.id!);
            
        }
    }

    this.uploadInProgress = false;
    input.value = '';
  }

  seeMore(){
    var newNbImages = this.indexNbImages + 11;
    var newPosition = this.indexNbImages + 1;
    for(let i = newPosition; i <= newNbImages; i++){
      if(i < this.temporaryPhotoList.length){
        this.photoList.push(this.temporaryPhotoList[i])
        this.indexNbImages = i;
      }
      else{
        this.morePhotos = false;
      }
    }
  }

}
