import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Order } from '../org.acme.vehicle_network';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class OrderService {

	
		private NAMESPACE: string = 'org.acme.vehicle_network.Order';
	



    constructor(private dataService: DataService<Order>) {
    };

    public getAll(): Observable<Order[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Order> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Order> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Order> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Order> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
