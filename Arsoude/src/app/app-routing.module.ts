import { CreationPt2Component } from './create/creation-pt2/creation-pt2.component';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { InfoRegComponent } from './authentification/info-reg/info-reg.component';
import { CreationComponent } from './create/creation/creation.component';
import { SearchComponent } from './search/search.component';
import { ApproveComponent } from './admin/approve/approve.component';
import { adminGuard } from './admin.guard';
import { userGuard } from './user.guard';
import { HelpPageComponent } from './help-page/help-page.component';
import { DetailsComponent } from './details/details/details.component';
import { UserTrailsComponent } from './userLisfOfTrails/user-trails/user-trails.component';
import { ProfileComponent } from './profile/profile/profile.component';

const routes : Routes = [
  {path: '', component : HomeComponent},
  {path:'login', component : LoginComponent},
  {path: 'register', component : RegisterComponent},
  {path:'infoReg/:username', component : InfoRegComponent},
  {path: 'creation', component: CreationComponent, canActivate: [userGuard]},
  {path: 'creation-step2', component: CreationPt2Component, canActivate: [userGuard]},
  {path: 'search', component: SearchComponent},
  {path : 'approve', component : ApproveComponent, canActivate:[adminGuard] },
  {path: 'details/:name', component: DetailsComponent},
  {path: 'help', component: HelpPageComponent},  
  {path: 'userTrails', component: UserTrailsComponent},
  {path: 'profile', component: ProfileComponent},    
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }