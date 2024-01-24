import { Component } from '@angular/core';
import { HelloworldService } from '../service/helloworld.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
hello : String = "pas de bonjour :C";



constructor(private helloService : HelloworldService, private router: Router){}


  async GetHello() : Promise<void> {

  this.hello = await this.helloService.GetWord()


 }


}
