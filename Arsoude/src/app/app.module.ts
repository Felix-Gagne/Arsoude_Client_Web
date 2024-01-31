import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreationComponent } from './creation/creation/creation.component';
import { InfoRegComponent } from './authentification/info-reg/info-reg.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CreationComponent,
    InfoRegComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
