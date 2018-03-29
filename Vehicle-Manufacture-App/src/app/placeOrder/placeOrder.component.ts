import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PlaceOrderService } from './placeOrder.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-placeOrder',
	templateUrl: './placeOrder.component.html',
	styleUrls: ['./placeOrder.component.css'],
  providers: [PlaceOrderService]
})
export class placeOrder  {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          orderId = new FormControl("", Validators.required);
        
  
      
          vehicle = new FormControl("", Validators.required);
      
          //orderStatus = new FormControl("", Validators.required);

      
          orderer = new FormControl("", Validators.required);
        
  


  constructor(private serviceOrder:PlaceOrderService, fb: FormBuilder) {
    this.myForm = fb.group({
    
      
          orderId:this.orderId,
        
    
        
          vehicle:this.vehicle,
          
        
         
        
    
        
          orderer:this.orderer
        
      
    });
  };

 
  


	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addNewOrder(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.vehicle_network.PlaceOrder",
      "order":{
      
        
          "orderId":this.orderId.value,
        
         "orderStatus": "PLACED",
        
          "vehicle":this.vehicle.value,        
      
        
          "owner":this.orderer.value
      }
      
    };

    this.myForm.setValue( {
    
      
        "orderId":null,
      
        //"orderStatus": null,
      
        "vehicle":null,        
    
      
        "orderer":null
    
    
  });

    return this.serviceOrder.addnewOrder(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "orderId":null,
        
        
          "vehicle":null,        
      
        
          "orderer":null
      
      
    });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


  
  resetForm(): void{
    this.myForm.setValue({
    
      
        "orderId":null,
            
        "vehicle":null,        
    
      
        "orderer":null
    
    
  });
  }

}
