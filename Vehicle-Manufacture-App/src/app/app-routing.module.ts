import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { TransactionComponent } from './Transaction/Transaction.component'
import { HomeComponent } from './home/home.component';

import { OrderComponent } from './Order/Order.component';
import { VehicleComponent } from './Vehicle/Vehicle.component';
import { placeOrder } from 'app/placeOrder/placeOrder.component';

const routes: Routes = [
    // { path: 'transaction', component: TransactionComponent },
    {path: '', component: HomeComponent},
		
		{ path: 'Order', component: OrderComponent},
		
    { path: 'Vehicle', component: VehicleComponent},
    { path: 'placeOrder', component: placeOrder},

		
		{path: '**', redirectTo:''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
