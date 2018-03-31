
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This is a simple sample that will demonstrate how to use the
// API connecting to a HyperLedger Blockchain Fabric
//
// The scenario here is using a simple model of a participant of 'person'


'use strict';


const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const winston = require('winston');
let config = require('config').get('businessNetworkIdentifier');

//const prettyjson = require('prettyjson');

// these are the credentials to use to connect to the Hyperledger Fabric
let cardname = require('config').get('cardName');

const LOG = winston.loggers.get('application');



class VehicleManufacturerNetwork 
{

    constructor() 
    {

        this.bizNetworkConnection = new BusinessNetworkConnection();
     
    }

  /** @description Initalizes the ComodityRegistry by making a connection to the Composer runtime
   * @return {Promise} A promise whose fullfillment means the initialization has completed
   */
    init() 
    {

        return this.bizNetworkConnection.connect(cardname)
      .then((result) => {
          this.businessNetworkDefinition = result;
          LOG.info('Vehicle network:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
      })

      // and catch any exceptions that are triggered
      .catch(function (error) {
          throw error;
      });

    }



  /** bootstrap into the resgitry a few example Commodity
    * @return {Promise} resolved when the assests have been created
  */
    _bootstrapTitles() 
    {
    
 /////////////////////////////////////////////////CREATING 2 PERSONS /////////////////////////////////       
        let factory = this.businessNetworkDefinition.getFactory();

        LOG.info('VehicleManufacturerNetwork', 'Creating a person');
        var person1 = factory.newResource('org.acme.vehicle_network', 'Person', 'username:person101');
        person1.email = 'Mostafa';
 
        var person2 = factory.newResource('org.acme.vehicle_network', 'Person', 'username:person102');
        person2.email = 'Mostafa';

 /////////////////////////////////////////////////CREATING 2 MANUFACTUERERS /////////////////////////////////
        LOG.info('VehicleManufacturerNetwork', 'Creating a manufacturer');
        var manufacturer1 = factory.newResource('org.acme.vehicle_network', 'Manufacturer', 'companyId:company101');
        manufacturer1.name = 'Toyota';
        
        var manufacturer2 = factory.newResource('org.acme.vehicle_network', 'Manufacturer', 'companyId:company102');
        manufacturer2.name = 'Kia';
      

 /////////////////////////////////////////////////CREATING VEHICLE ASSET /////////////////////////////////
 LOG.info('VehicleManufacturerNetwork', 'Creating a vehicle asset');
 
 
 var vehicle = factory.newResource('org.acme.vehicle_network', 'Vehicle', 'vin:vehicle101');

 vehicle.modelType = "Sedan";
 vehicle.colour = "Red";
 vehicle.yearOfManufacture = 2020;
 vehicle.trim = "good";
 vehicle.interior = "good";
 vehicle.extras = ["AC", "4 DOORS"];

 let make = factory.newRelationship('org.acme.vehicle_network', 'Manufacturer', 'companyId:company101');
 vehicle.make = make;

 /////////////////////////////////////////////////CREATING ORDER ASSET /////////////////////////////////
        LOG.info('VehicleManufacturerNetwork', 'Creating a order asset');
        var assetOrder = factory.newResource('org.acme.vehicle_network', 'Order', 'orderId:order101');
        
        assetOrder.orderStatus = "PLACED";

        let vehicleRelationship = factory.newRelationship('org.acme.vehicle_network', 'Vehicle', 'vin:vehicle101');
        assetOrder.vehicle = vehicleRelationship;
      
        let ordererPerson = factory.newRelationship('org.acme.vehicle_network', 'Person', 'username:person101');
        assetOrder.owner = ordererPerson;

/////////////////////////////////////////////////////////////////////////////

return this.bizNetworkConnection.getParticipantRegistry('org.acme.vehicle_network.Person')
      .then((personRegistry) => {
          return personRegistry.addAll([person1, person2]);
      })
      .then(() => {
        return this.bizNetworkConnection.getParticipantRegistry('org.acme.vehicle_network.Manufacturer');
    })
      .then((participantRegistry) => {
          return participantRegistry.addAll([manufacturer1, manufacturer2]);
    })
    .then(() => {
        return this.bizNetworkConnection.getAssetRegistry('org.acme.vehicle_network.Vehicle');
    })
      .then((assetRegistry) => {
          return assetRegistry.add(vehicle);
    })
      .then(() => {
        return this.bizNetworkConnection.getAssetRegistry('org.acme.vehicle_network.Order');
    })
      .then((assetRegistry) => {
          return assetRegistry.add(assetOrder);
    }).catch(function (error) {
          console.log(error);
          LOG.error('VehicleManufacturerNetwork:_bootstrapTitles', error);
          throw error;
      });

    }
    
    
    
/**
   * @description - run the add default assets command
   * @param {Object} args passed from the command line
   * @return {Promise} resolved when complete
   */
    static addDefaultCmd(args) 
    {

        let lr = new VehicleManufacturerNetwork('Vehicle-manufacture-network');


        return lr.init()

    .then(() => {
        return lr._bootstrapTitles();
    })

    .then((results) => {
        LOG.info('participants & assets are added successfully');
    })
      .catch(function (error) {
        /* potentially some code for generating an error specific message here */
          throw error;
      });
    }

 
}
module.exports = VehicleManufacturerNetwork;

VehicleManufacturerNetwork.addDefaultCmd();



