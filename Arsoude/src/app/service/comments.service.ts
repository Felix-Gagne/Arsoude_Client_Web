import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentDTO } from '../models/CommentDTO';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  
  private baseUrl = environment.apiUrl + 'api/Comments';

  constructor(public http : HttpClient) { }


  async sendComment(dto : CommentDTO){
    try{
      let comment = await lastValueFrom(this.http.post<any>(this.baseUrl + "/PostComment", dto));
      console.log(comment);
      return comment;
    }
    catch(error : any){
      console.log(error);
    }
  }

  async getComments(trailId : number){
    try{
      let comments = await lastValueFrom(this.http.get<any>(this.baseUrl + "/GetTrailComments/" + trailId));
      console.log(comments);
      return comments;
    }
    catch(error : any){
      console.log(error);
    }
  }
}
