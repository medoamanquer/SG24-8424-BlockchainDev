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

/* global getFactory getAssetRegistry getParticipantRegistry emit */

// MANUFACTURER FUNCTIONS
/**
 * Place an order for a vehicle
 * @param {org.acme.vehicle_network.PlaceOrder} placeOrder - the PlaceOrder transaction
 * @transaction
 */
function placeOrder(orderRequest) {
  	console.log('placeOrder')
  
  	var factory = getFactory();
  	var namespace = 'org.acme.vehicle_network';
 
  var order = orderRequest.order;

    // save the order
    return getAssetRegistry(order.getFullyQualifiedType())
  	.then(function (assetRegistry) {
    	return assetRegistry.add(order);
    })
  	.then(function () {
      // emit the event
      var placeOrderEvent = factory.newEvent(namespace, 'PlaceOrderEvent');
      placeOrderEvent.order = order;
     
      emit(placeOrderEvent);
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
  
   return getAssetRegistry(namespace + '.Order')
  	.then(function(orderRegistry) {
      // update the order
      var order = updateOrderRequest.order;
      order.orderStatus = updateOrderRequest.orderStatus;
      return orderRegistry.update(order);
    })
  	.then(function() {
      // emit the event
      var updateOrderStatusEvent = factory.newEvent(namespace, 'UpdateOrderStatusEvent');
      updateOrderStatusEvent.order = updateOrderRequest.order;
      updateOrderStatusEvent.orderStatus = updateOrderRequest.order.orderStatus;
      emit(updateOrderStatusEvent);
    });
}
