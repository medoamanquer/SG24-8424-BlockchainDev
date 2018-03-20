import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OrderService } from './Order.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Order',
	templateUrl: './Order.component.html',
	styleUrls: ['./Order.component.css'],
  providers: [OrderService]
})
export class OrderComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          orderId = new FormControl("", Validators.required);
        
  
      
          vehicleDetails = new FormControl("", Validators.required);
        
  
      
          orderStatus = new FormControl("", Validators.required);
        
  
      
          options = new FormControl("", Validators.required);
        
  
      
          orderer = new FormControl("", Validators.required);
        
  


  constructor(private serviceOrder:OrderService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          orderId:this.orderId,
        
    
        
          vehicleDetails:this.vehicleDetails,
        
    
        
          orderStatus:this.orderStatus,
        
    
        
          options:this.options,
        
    
        
          orderer:this.orderer
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceOrder.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

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

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.vehicle_network.Order",
      
        
          "orderId":this.orderId.value,
        
      
        
          "vehicleDetails":this.vehicleDetails.value,
        
      
        
          "orderStatus":this.orderStatus.value,
        
      
        
          "options":this.options.value,
        
      
        
          "orderer":this.orderer.value
        
      
    };

    this.myForm.setValue({
      
        
          "orderId":null,
        
      
        
          "vehicleDetails":null,
        
      
        
          "orderStatus":null,
        
      
        
          "options":null,
        
      
        
          "orderer":null
        
      
    });

    return this.serviceOrder.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "orderId":null,
        
      
        
          "vehicleDetails":null,
        
      
        
          "orderStatus":null,
        
      
        
          "options":null,
        
      
        
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


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.vehicle_network.Order",
      
        
          
        
    
        
          
            "vehicleDetails":this.vehicleDetails.value,
          
        
    
        
          
            "orderStatus":this.orderStatus.value,
          
        
    
        
          
            "options":this.options.value,
          
        
    
        
          
            "orderer":this.orderer.value
          
        
    
    };

    return this.serviceOrder.updateAsset(form.get("orderId").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceOrder.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceOrder.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "orderId":null,
          
        
          
            "vehicleDetails":null,
          
        
          
            "orderStatus":null,
          
        
          
            "options":null,
          
        
          
            "orderer":null 
          
        
      };



      
        if(result.orderId){
          
            formObject.orderId = result.orderId;
          
        }else{
          formObject.orderId = null;
        }
      
        if(result.vehicleDetails){
          
            formObject.vehicleDetails = result.vehicleDetails;
          
        }else{
          formObject.vehicleDetails = null;
        }
      
        if(result.orderStatus){
          
            formObject.orderStatus = result.orderStatus;
          
        }else{
          formObject.orderStatus = null;
        }
      
        if(result.options){
          
            formObject.options = result.options;
          
        }else{
          formObject.options = null;
        }
      
        if(result.orderer){
          
            formObject.orderer = result.orderer;
          
        }else{
          formObject.orderer = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "orderId":null,
        
      
        
          "vehicleDetails":null,
        
      
        
          "orderStatus":null,
        
      
        
          "options":null,
        
      
        
          "orderer":null 
        
      
      });
  }

}
