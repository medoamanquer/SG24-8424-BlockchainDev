import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Vehicle } from '../org.acme.vehicle_network';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class VehicleService {

	
		private NAMESPACE: string = 'org.acme.vehicle_network.Vehicle';
	



    constructor(private dataService: DataService<Vehicle>) {
    };

    public getAll(): Observable<Vehicle[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Vehicle> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Vehicle> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Vehicle> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Vehicle> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
