import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateHouseComponent } from './create-house/create-house.component';
import { HeaderComponent } from './header/header.component';
import { HouseDialogSuccessComponent } from './house-dialog-success/house-dialog-success.component';
import { HouseInfoComponent } from './house-info/house-info.component';
import { HousesComponent } from './houses/houses.component';
import { initIPFS, IPFS } from './ipfs';
import { ContractService } from './services/contract.service';
import { IpfsService } from './services/ipfs.service';
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
    MatTableModule,
    HttpClientModule,
    MatSelectModule,
    MatSnackBarModule,
    LoggerModule.forRoot(
      {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR
      }
    )
  ],
  providers: [
    ContractService,
    Web3Service,
    MatDatepickerModule,
    MatNativeDateModule,
    IpfsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initIPFS,
      multi: true,
      deps: [IPFS]
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
