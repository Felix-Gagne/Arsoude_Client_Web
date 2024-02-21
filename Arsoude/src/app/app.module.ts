import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreationComponent } from './create/creation/creation.component';
import { InfoRegComponent } from './authentification/info-reg/info-reg.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { CreationPt2Component } from './create/creation-pt2/creation-pt2.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { SearchComponent } from './search/search.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HelpPageComponent } from './help-page/help-page.component';
import { DetailsComponent } from './details/details/details.component';
import { ApproveComponent } from './admin/approve/approve.component';
import { UserTrailsComponent } from './userLisfOfTrails/user-trails/user-trails.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { MatInputModule } from '@angular/material/input';

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CreationComponent,
    InfoRegComponent,
    CreationPt2Component,
    SearchComponent,
    ApproveComponent,
    HelpPageComponent,
    DetailsComponent,
    UserTrailsComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatInputModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    GoogleMapsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    provideFirebaseApp(() => initializeApp({"projectId":"arsoudeserv","appId":"1:35541229487:web:43209dd14e09782699d95a","storageBucket":"arsoudeserv.appspot.com","apiKey":"AIzaSyDYzVZvjfOaCuOYWRJIOdGTpp03J3AZQco","authDomain":"arsoudeserv.firebaseapp.com","messagingSenderId":"35541229487"})),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
