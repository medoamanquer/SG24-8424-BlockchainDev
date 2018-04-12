import { Component } from '@angular/core';
import { Vehicle } from './Vehicle';
import {Http} from '@angular/http';
@Component ({
   selector: 'product-form',
   templateUrl: './submit-transaction.component.html'
})

export class TransactionProcessor {

    http: Http;

    constructor(http: Http) {
        this.http=http;
    }
           model = new Vehicle(1,"","","","", "");



transactionId ="";
   
   submitTransaction()
   {
 // prepare parameter in simple form to be sent to backend 
        this.http.get('http://localhost:8000/changeOwner/'+this.model.id+'-'+this.model.owner)
      .map(res =>this.transactionId)  
       .subscribe(id => this.transactionId = id);
       
     
   }
}