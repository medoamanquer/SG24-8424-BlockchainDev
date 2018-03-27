import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.acme.vehicle_network{
   export class VehicleDetails {
      make: Manufacturer;
      modelType: string;
      colour: string;
      yearOfManufacture: number;
   }
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
   export enum OrderStatus {
      PLACED,
      SCHEDULED_FOR_MANUFACTURE,
      VIN_ASSIGNED,
      OWNER_ASSIGNED,
      DELIVERED,
   }
   export class Options {
      trim: string;
      interior: string;
      extras: string[];
   }
   export class Order extends Asset {
      orderId: string;
      vehicleDetails: VehicleDetails;
      orderStatus: OrderStatus;
      options: Options;
      orderer: Person;
   }
   export class PlaceOrder extends Transaction {
      orderId: string;
      vehicleDetails: VehicleDetails;
      options: Options;
      orderer: Person;
   }
   export class PlaceOrderEvent extends Event {
      orderId: string;
      vehicleDetails: VehicleDetails;
      options: Options;
      orderer: Person;
   }
   export class UpdateOrderStatus extends Transaction {
      orderStatus: OrderStatus;
      vin: string;
      order: Order;
   }
   export class UpdateOrderStatusEvent extends Event {
      orderStatus: OrderStatus;
      order: Order;
   }
   export class Regulator extends Company {
   }
   export enum VehicleStatus {
      ACTIVE,
      OFF_THE_ROAD,
      SCRAPPED,
   }
   export class Vehicle extends Asset {
      vin: string;
      vehicleDetails: VehicleDetails;
      vehicleStatus: VehicleStatus;
      owner: Person;
   }
// }
