import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { VehicleService } from './Vehicle.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Vehicle',
	templateUrl: './Vehicle.component.html',
	styleUrls: ['./Vehicle.component.css'],
  providers: [VehicleService]
})
export class VehicleComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          vin = new FormControl("", Validators.required);
        
  
      
          vehicleDetails = new FormControl("", Validators.required);
        
  
      
          vehicleStatus = new FormControl("", Validators.required);
        
  
      
          owner = new FormControl("", Validators.required);
        
  


  constructor(private serviceVehicle:VehicleService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          vin:this.vin,
        
    
        
          vehicleDetails:this.vehicleDetails,
        
    
        
          vehicleStatus:this.vehicleStatus,
        
    
        
          owner:this.owner
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceVehicle.getAll()
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
      $class: "org.acme.vehicle_network.Vehicle",
      
        
          "vin":this.vin.value,
        
      
        
          "vehicleDetails":this.vehicleDetails.value,
        
      
        
          "vehicleStatus":this.vehicleStatus.value,
        
      
        
          "owner":this.owner.value
        
      
    };

    this.myForm.setValue({
      
        
          "vin":null,
        
      
        
          "vehicleDetails":null,
        
      
        
          "vehicleStatus":null,
        
      
        
          "owner":null
        
      
    });

    return this.serviceVehicle.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "vin":null,
        
      
        
          "vehicleDetails":null,
        
      
        
          "vehicleStatus":null,
        
      
        
          "owner":null 
        
      
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
      $class: "org.acme.vehicle_network.Vehicle",
      
        
          
        
    
        
          
            "vehicleDetails":this.vehicleDetails.value,
          
        
    
        
          
            "vehicleStatus":this.vehicleStatus.value,
          
        
    
        
          
            "owner":this.owner.value
          
        
    
    };

    return this.serviceVehicle.updateAsset(form.get("vin").value,this.asset)
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

    return this.serviceVehicle.deleteAsset(this.currentId)
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

    return this.serviceVehicle.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "vin":null,
          
        
          
            "vehicleDetails":null,
          
        
          
            "vehicleStatus":null,
          
        
          
            "owner":null 
          
        
      };



      
        if(result.vin){
          
            formObject.vin = result.vin;
          
        }else{
          formObject.vin = null;
        }
      
        if(result.vehicleDetails){
          
            formObject.vehicleDetails = result.vehicleDetails;
          
        }else{
          formObject.vehicleDetails = null;
        }
      
        if(result.vehicleStatus){
          
            formObject.vehicleStatus = result.vehicleStatus;
          
        }else{
          formObject.vehicleStatus = null;
        }
      
        if(result.owner){
          
            formObject.owner = result.owner;
          
        }else{
          formObject.owner = null;
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
      
        
          "vin":null,
        
      
        
          "vehicleDetails":null,
        
      
        
          "vehicleStatus":null,
        
      
        
          "owner":null 
        
      
      });
  }

}
