import {NgModule} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatOptionModule,
    MatSelectModule
  ],
  exports: [
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatOptionModule,
    MatSelectModule
  ],
})
export class MaterialModule { }
