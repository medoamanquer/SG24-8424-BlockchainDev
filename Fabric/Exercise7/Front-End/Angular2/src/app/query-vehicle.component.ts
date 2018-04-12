import { Component } from '@angular/core';
import { Vehicle } from './Vehicle';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Component ({
   selector: 'product-form',
   templateUrl: './query-vehicle.component.html'
})

export class QueryVehicle {

    http: Http;

 
    constructor(http: Http) {
        
        this.http=http;
    }
           model = new Vehicle(1,"","","","", "");



   
   getVehicle()
   {
     
     

    this.http.get('http://localhost:8000/getVehicle/'+this.model.id)
      // Call map on the response observable to get the parsed people object
      .map(res => res.json())
      // Subscribe to the observable to get the parsed people object and attach it to the
      // component
      .subscribe(data => this.model = data)
       

    }
       
     
   }