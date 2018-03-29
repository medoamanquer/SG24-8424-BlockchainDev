import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { PlaceOrder } from '../org.acme.vehicle_network';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class PlaceOrderService {

	
		private NAMESPACE: string = 'org.acme.vehicle_network.PlaceOrder';
	



    constructor(private dataService: DataService<PlaceOrder>) {
    };

    public addnewOrder(item : any): Observable <PlaceOrder>
    {
      return this.dataService.addnewOrder(item);
    }

}
