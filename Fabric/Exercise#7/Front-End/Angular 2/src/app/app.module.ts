import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';
import { VehicleFormComponent } from "./vehicle-form.component";
import { QueryVehicle } from "./query-vehicle.component"; 
import { TransactionProcessor } from "./submit-transaction.component";

const appRoutes: Routes = [
   { path: 'Create', component: VehicleFormComponent },
   { path: 'Query', component: QueryVehicle },
   { path: 'Submit', component: TransactionProcessor }
   
];

@NgModule({
  declarations: [
    AppComponent,
    VehicleFormComponent,
    QueryVehicle,
    TransactionProcessor
  ],
  imports: [
    BrowserModule,
    
    FormsModule,
    HttpModule,   RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
