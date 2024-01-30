import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { InfoRegComponent } from './authentification/info-reg/info-reg.component';
import { CreationComponent } from './creation/creation/creation.component';

const routes : Routes = [
  {path: '', component : HomeComponent},
  {path:'login', component : LoginComponent},
  {path: 'register', component : RegisterComponent},
  {path:'infoReg/:username', component : InfoRegComponent}
  {path: 'creation', component: CreationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
