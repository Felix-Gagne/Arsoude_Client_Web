import { Component } from '@angular/core';
import { ModifUserDTO } from 'src/app/models/ModifUserDTO';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user : ModifUserDTO = new ModifUserDTO();
  isEditorMode : boolean = false;

  firstName? : string;
  lastName? : string;
  areaCode? : string;
  houseNo? : number;
  street? : string;
  city? : string;
  state? : string;
  yearOfBirth? : number;
  monthOfBirth? : number;


  constructor(public service : UserService){}

  async ngOnInit(){
    this.user = await this.service.getUserInfo();
    console.log(this.user)
  }

  switchMode(){
    if(this.isEditorMode == false){
      this.lastName = undefined;
      this.firstName = undefined;
      this.areaCode = undefined;
      this.houseNo = undefined;
      this.street = undefined;
      this.city = undefined;
      this.state = undefined;
      this.yearOfBirth = undefined;
      this.monthOfBirth = undefined;
      this.isEditorMode = true
    }
    else{
      this.isEditorMode = false;
    }
  }

  async edit(){
    let dto = new ModifUserDTO(this.lastName, this.firstName, this.areaCode, this.houseNo, this.street, 
      this.city, this.state, this.yearOfBirth, this.monthOfBirth);

    await this.service.editUser(dto);

    this.user = await this.service.getUserInfo();

    this.isEditorMode = false;
  }
}
