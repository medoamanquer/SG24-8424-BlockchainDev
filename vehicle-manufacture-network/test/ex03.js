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

'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const path = require('path');

const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));

const namespace = 'org.acme.vehicle_network';
const vin = '1a2b3c4d5e6f7g8h9';

describe('EX03-Test', () => {
    const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );
    let adminConnection;
    let businessNetworkConnection;
    let factory;

    before(async () => {
        // Embedded connection used for local testing
        const connectionProfile = {
            name: 'embedded',
            'x-type': 'embedded'
        };
        // Generate certificates for use with the embedded connection
        const credentials = CertificateUtil.generate({ commonName: 'admin' });

        // PeerAdmin identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };

        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);

        const deployerCardName = 'PeerAdmin';
        adminConnection = new AdminConnection({ cardStore: cardStore });

        await adminConnection.importCard(deployerCardName, deployerCard);
        await adminConnection.connect(deployerCardName);
    });

    beforeEach(async () => {
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });

        const adminUserName = 'admin';
        let adminCardName;
        const businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
        
        // Install the Composer runtime for the new business network
        await adminConnection.install(businessNetworkDefinition);

        // Start the business network and configure an network admin identity
        const startOptions = {
            networkAdmins: [
                {
                    userName: adminUserName,
                    enrollmentSecret: 'adminpw'
                }
            ]
        };
        const adminCards = await adminConnection.start(businessNetworkDefinition.getName(), businessNetworkDefinition.getVersion(), startOptions);

        // Import the network admin identity for us to use
        adminCardName = `${adminUserName}@${businessNetworkDefinition.getName()}`;

        await adminConnection.importCard(adminCardName, adminCards.get(adminUserName));

        // Connect to the business network using the network admin identity
        await businessNetworkConnection.connect(adminCardName);

        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    });

    describe('InspectVehicle', () => {
        it('should be able to mark a vehicle manufactured older than 2020 as not importable', async () => {

            // create the manufacturer
            const manufacturer = factory.newResource(namespace, 'Manufacturer', 'Arium');
            manufacturer.name = 'Arium';

            const manufacturerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacturer');
            await manufacturerRegistry.add(manufacturer);

            // create the vehicle
            const vehicle = factory.newResource(namespace, 'Vehicle', vin);
            vehicle.make = factory.newRelationship(namespace, 'Manufacturer', manufacturer.$identifier);
            vehicle.trim = 'trim';
            vehicle.interior = 'int';
            vehicle.extras = ['none'];
            vehicle.modelType = 'model';
            vehicle.colour = 'red';
            vehicle.yearOfManufacture = 2019;

            const vehicleRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Vehicle');
            await vehicleRegistry.add(vehicle);

            const inspectVehicleTx = factory.newTransaction(namespace, 'InspectVehicle');
            inspectVehicleTx.vehicle = factory.newRelationship(namespace, 'Vehicle', vehicle.$identifier);

            await businessNetworkConnection.submitTransaction(inspectVehicleTx);

            const vr = await businessNetworkConnection.getAssetRegistry(namespace + '.Vehicle');
            const v = await vr.get(vehicle.$identifier);

            v.isImportable.should.equal(false);
        });

        it('should be able to mark a vehicle manufactured newer than 2020 as importable', async () => {

            // create the manufacturer
            const manufacturer = factory.newResource(namespace, 'Manufacturer', 'Arium');
            manufacturer.name = 'Arium';

            const manufacturerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacturer');
            await manufacturerRegistry.add(manufacturer);

          
            // create the vehicle
            const vehicle = factory.newResource(namespace, 'Vehicle', vin);
            vehicle.make = factory.newRelationship(namespace, 'Manufacturer', manufacturer.$identifier);
            vehicle.trim = 'trim';
            vehicle.interior = 'int';
            vehicle.extras = ['none'];
            vehicle.modelType = 'model';
            vehicle.colour = 'red';
            vehicle.yearOfManufacture = 2023;

            const vehicleRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Vehicle');
            await vehicleRegistry.add(vehicle);

            const inspectVehicleTx = factory.newTransaction(namespace, 'InspectVehicle');
            inspectVehicleTx.vehicle = factory.newRelationship(namespace, 'Vehicle', vehicle.$identifier);

            await businessNetworkConnection.submitTransaction(inspectVehicleTx);

            const vr = await businessNetworkConnection.getAssetRegistry(namespace + '.Vehicle');
            const v = await vr.get(vehicle.$identifier);

            v.isImportable.should.equal(true);
        });
    });
});