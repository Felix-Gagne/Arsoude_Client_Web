import { CreationPt2Component } from './create/creation-pt2/creation-pt2.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentification/login/login.component';
import { CreationComponent } from './create/creation/creation.component';

const routes : Routes = [
  {path: '', component : LoginComponent},
  {path: 'creation', component: CreationComponent},
  {path: 'creation-step2', component: CreationPt2Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }