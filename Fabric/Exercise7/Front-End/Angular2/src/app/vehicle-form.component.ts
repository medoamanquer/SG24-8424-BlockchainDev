import { Component } from '@angular/core';
import { Vehicle } from './Vehicle';
import {Http} from '@angular/http';
@Component ({
   selector: 'product-form',
   templateUrl: './vehicle-form.component.html'
})

export class VehicleFormComponent {

    http: Http;

    constructor(http: Http) {
        this.http=http;
    }
   model = new Vehicle(1,"Car Model","Red","1212121212","New Cairo", "Ahmed")


transactionId : any;
   
   saveVehicle()
   {
     
     
 // prepare parameter in simple form to be sent to backend 
 var vehicleInfo=this.model.id+'-'+this.model.modelType+'-'+this.model.colour + '-'+this.model.timestamp+'-'+ this.model.location +'-'+ this.model.owner;
        this.http.get('http://localhost:8000/addVehicle/'+vehicleInfo)
     //.map(res=>res.json)
      .subscribe(res => this.transactionId );
     
   }
}