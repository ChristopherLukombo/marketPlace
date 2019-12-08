import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateHouseComponent } from './create-house/create-house.component';
import { HeaderComponent } from './header/header.component';
import { HouseDialogSuccessComponent } from './house-dialog-success/house-dialog-success.component';
import { HouseInfoComponent } from './house-info/house-info.component';
import { HousesComponent } from './houses/houses.component';
import { ContractService } from './services/contract.service';
import { Web3Service } from './services/web3.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateHouseComponent,
    HousesComponent,
    HeaderComponent,
    HouseInfoComponent,
    HouseDialogSuccessComponent
  ],
  entryComponents: [
    HouseDialogSuccessComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
  providers: [
    ContractService,
    Web3Service,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
