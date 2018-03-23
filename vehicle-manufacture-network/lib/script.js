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

// MANUFACTURER FUNCTIONS
/**
 * Place an order for a vehicle
 * @param {org.acme.vehicle_network.PlaceOrder} placeOrder - the PlaceOrder transaction
 * @transaction
 */
function placeOrder(orderRequest) {
  
  	var factory = getFactory();
  	var namespace = 'org.acme.vehicle_network';
    var url = 'https://blockchainintegrationtest.eu-gb.mybluemix.net/compute';
  
  	var order = factory.newResource(namespace, 'Order', orderRequest.orderId);
    order.vehicleDetails = orderRequest.vehicleDetails;
    order.orderStatus = 'PLACED';
    order.orderer = factory.newRelationship(namespace, 'Person', orderRequest.orderer.getIdentifier());
  	order.options = orderRequest.options;

    // save the order
    return getAssetRegistry(order.getFullyQualifiedType())
  	.then(function (assetRegistry) {
    	return assetRegistry.add(order);
    })
  	.then(function () {
      // emit the event
      var placeOrderEvent = factory.newEvent(namespace, 'PlaceOrderEvent');
      placeOrderEvent.orderId = order.orderId;
      placeOrderEvent.vehicleDetails = order.vehicleDetails;
      placeOrderEvent.options = order.options;
      placeOrderEvent.orderer = order.orderer;
      emit(placeOrderEvent);
      return post( url,order )
    }).then(function (result) {
				
    });
}


/**
 * Update the status of an order
 * @param {org.acme.vehicle_network.UpdateOrderStatus} updateOrderStatus - the UpdateOrderStatus transaction
 * @transaction
 */
function updateOrderStatus(updateOrderRequest) {
 	console.log('updateOrderStatus');

    var factory = getFactory();
  	var namespace = 'org.acme.vehicle_network';
  
  	// get vehicle registry
  	return getAssetRegistry(namespace + '.Vehicle')
  	.then(function (vehicleRegistry) {
      if (updateOrderRequest.orderStatus === 'VIN_ASSIGNED') {
          if (!updateOrderRequest.vin) {
              throw new Error('Value for VIN was expected'); 
          }
          // create a vehicle
          var vehicle = factory.newResource(namespace, 'Vehicle', updateOrderRequest.vin );
          vehicle.vehicleDetails = updateOrderRequest.order.vehicleDetails;
          vehicle.vehicleStatus = 'OFF_THE_ROAD';
          return vehicleRegistry.add(vehicle);
      } else if(updateOrderRequest.orderStatus === 'OWNER_ASSIGNED') {
          if (!updateOrderRequest.vin) {
              throw new Error('Value for VIN was expected'); 
          }

          // assign the owner of the vehicle to be the person who placed the order
          return vehicleRegistry.get(updateOrderRequest.vin)
          .then(function (vehicle) {
            vehicle.vehicleStatus = 'ACTIVE';
            vehicle.owner = factory.newRelationship(namespace, 'Person', updateOrderRequest.order.orderer.username);
            return vehicleRegistry.update(vehicle);
          });
      }
    })
  	.then(function() {
      return getAssetRegistry(namespace + '.Order');
    })
  	.then(function(orderRegistry) {
      // update the order
      var order = updateOrderRequest.order;
      order.orderStatus = updateOrderRequest.orderStatus;
      return orderRegistry.update(order);
    })
  	.then(function() {
      // emit the event
      var updateOrderStatusEvent = factory.newEvent(namespace, 'UpdateOrderStatusEvent');
      updateOrderStatusEvent.orderStatus = updateOrderRequest.order.orderStatus;
      updateOrderStatusEvent.order = updateOrderRequest.order;
      emit(updateOrderStatusEvent);
    });
}
