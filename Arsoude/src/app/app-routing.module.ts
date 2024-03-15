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
import { HelldiveComponent } from './helldive/helldive.component';
import { NewSearchPageComponent } from './newSearch/new-search-page/new-search-page.component';
import { SearchPageTrailListComponent } from './newSearch/new-search-page/trailList/search-page-trail-list/search-page-trail-list.component';
import { SearchPageDetailComponent } from './newSearch/new-search-page/search-page-detail/search-page-detail.component';

const routes : Routes = [
  {path: '', component : NewSearchPageComponent, children: [
    { path: '', component: SearchPageTrailListComponent},
    { path: 'detailResearch/:id', component: SearchPageDetailComponent}
  ]},
  {path:'login', component : LoginComponent},
  {path: 'register', component : RegisterComponent},
  {path:'infoReg/:username', component : InfoRegComponent},
  {path: 'creation', component: CreationComponent, canActivate: [userGuard]},
  {path: 'creation-step2', component: CreationPt2Component, canActivate: [userGuard]},
  {path: 'search/:keyword', component: SearchComponent},
  {path: 'search', component: SearchComponent},
  {path : 'approve', component : ApproveComponent, canActivate:[adminGuard] },
  {path: 'details/:name', component: DetailsComponent},
  {path: 'help', component: HelpPageComponent},  
  {path: 'userTrails', component: UserTrailsComponent},
  {path: 'profile', component: ProfileComponent}, 
  {path: 'HELLDIVERS', component : HelldiveComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }