import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.acme.vehicle_network{
   export abstract class Company extends Participant {
      companyId: string;
      name: string;
   }
   export class Person extends Participant {
      username: string;
      email: string;
   }
   export class Manufacturer extends Company {
   }
   export class Regulator extends Company {
   }
   export class Order extends Asset {
      orderId: string;
      orderStatus: OrderStatus;
      vehicle: Vehicle;
      owner: Person;
   }
   export class Vehicle extends Asset {
      vin: string;
      trim: string;
      interior: string;
      extras: string[];
      make: Manufacturer;
      modelType: string;
      colour: string;
      yearOfManufacture: number;
   }
   export class PlaceOrder extends Transaction {
      order: Order;
   }
   export class UpdateOrderStatus extends Transaction {
      orderStatus: OrderStatus;
      order: Order;
   }
   export class UpdateOrderStatusEvent extends Event {
      orderStatus: OrderStatus;
      order: Order;
   }
   export class PlaceOrderEvent extends Event {
      order: Order;
   }
   export enum OrderStatus {
      PLACED,
      DELIVERED,
   }
// }
