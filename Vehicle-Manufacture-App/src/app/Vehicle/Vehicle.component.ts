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
        
  
      
          trim = new FormControl("", Validators.required);
        
  
      
          interior = new FormControl("", Validators.required);
        
  
      
          extras = new FormControl("", Validators.required);
        
  
      
          make = new FormControl("", Validators.required);
        
  
      
          modelType = new FormControl("", Validators.required);
        
  
      
          colour = new FormControl("", Validators.required);
        
  
      
          yearOfManufacture = new FormControl("", Validators.required);
        
  


  constructor(private serviceVehicle:VehicleService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          vin:this.vin,
        
    
        
          trim:this.trim,
        
    
        
          interior:this.interior,
        
    
        
          extras:this.extras,
        
    
        
          make:this.make,
        
    
        
          modelType:this.modelType,
        
    
        
          colour:this.colour,
        
    
        
          yearOfManufacture:this.yearOfManufacture
        
    
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
        
      
        
          "trim":this.trim.value,
        
      
        
          "interior":this.interior.value,
        
      
        
          "extras":this.extras.value,
        
      
        
          "make":this.make.value,
        
      
        
          "modelType":this.modelType.value,
        
      
        
          "colour":this.colour.value,
        
      
        
          "yearOfManufacture":this.yearOfManufacture.value
        
      
    };

    this.myForm.setValue({
      
        
          "vin":null,
        
      
        
          "trim":null,
        
      
        
          "interior":null,
        
      
        
          "extras":null,
        
      
        
          "make":null,
        
      
        
          "modelType":null,
        
      
        
          "colour":null,
        
      
        
          "yearOfManufacture":null
        
      
    });

    return this.serviceVehicle.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "vin":null,
        
      
        
          "trim":null,
        
      
        
          "interior":null,
        
      
        
          "extras":null,
        
      
        
          "make":null,
        
      
        
          "modelType":null,
        
      
        
          "colour":null,
        
      
        
          "yearOfManufacture":null 
        
      
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
      
        
          
        
    
        
          
            "trim":this.trim.value,
          
        
    
        
          
            "interior":this.interior.value,
          
        
    
        
          
            "extras":this.extras.value,
          
        
    
        
          
            "make":this.make.value,
          
        
    
        
          
            "modelType":this.modelType.value,
          
        
    
        
          
            "colour":this.colour.value,
          
        
    
        
          
            "yearOfManufacture":this.yearOfManufacture.value
          
        
    
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
          
        
          
            "trim":null,
          
        
          
            "interior":null,
          
        
          
            "extras":null,
          
        
          
            "make":null,
          
        
          
            "modelType":null,
          
        
          
            "colour":null,
          
        
          
            "yearOfManufacture":null 
          
        
      };



      
        if(result.vin){
          
            formObject.vin = result.vin;
          
        }else{
          formObject.vin = null;
        }
      
        if(result.trim){
          
            formObject.trim = result.trim;
          
        }else{
          formObject.trim = null;
        }
      
        if(result.interior){
          
            formObject.interior = result.interior;
          
        }else{
          formObject.interior = null;
        }
      
        if(result.extras){
          
            formObject.extras = result.extras;
          
        }else{
          formObject.extras = null;
        }
      
        if(result.make){
          
            formObject.make = result.make;
          
        }else{
          formObject.make = null;
        }
      
        if(result.modelType){
          
            formObject.modelType = result.modelType;
          
        }else{
          formObject.modelType = null;
        }
      
        if(result.colour){
          
            formObject.colour = result.colour;
          
        }else{
          formObject.colour = null;
        }
      
        if(result.yearOfManufacture){
          
            formObject.yearOfManufacture = result.yearOfManufacture;
          
        }else{
          formObject.yearOfManufacture = null;
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
        
      
        
          "trim":null,
        
      
        
          "interior":null,
        
      
        
          "extras":null,
        
      
        
          "make":null,
        
      
        
          "modelType":null,
        
      
        
          "colour":null,
        
      
        
          "yearOfManufacture":null 
        
      
      });
  }

}
