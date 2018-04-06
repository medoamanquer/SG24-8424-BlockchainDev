const shim = require ('fabric-shim'); // This is Fabric shim interface for nodejs


// Implementing the chaincode
var chaincode = class {
    Init(stub) {
        // The init process of the vehicle chaincode does nothing.
        return shim.success(); // Indicates the success of the init of the chaincode
    }

    Invoke(stub) {
        let functionAndParams = stub.getFunctionAndParameters(); // Getting the function as first argument, and parameters as second argument.
        let fcn = functionAndParams.fcn;
        let params = functionAndParams.params;
        var vehicle ={};
        // Create a switch case statement to emphasis the use of the invoke function
        switch (fcn) {
            case "initLedger":
                vehicle = {
                    ModelType: "New Car",
                    Colour: "Red",
                    Timestamp: "1504054225",
                    Owner: "Ahmad"
                };
                return stub.putState("0", Buffer.from(JSON.stringify(vehicle))).then(
                    () =>  {
                       return shim.success();
                    }
                ).catch(
                    () => {
                       return shim.error("Couldn't init the ledger");
                    }
                );
                break;

            case "recordVehicle":
                if (params.length != 5) {
                    return shim.error("Error Expecting 5 arguments & function");
                }

                vehicle = {
                    ModelType: params[1],
                    Colour: params[2],
                    Timestamp: params[3],
                    Owner: params[4]
                };

                return stub.putState(params[0], Buffer.from(JSON.stringify(vehicle))).then(
                    () => {
                        return shim.success();
                    }
                ).catch(
                    () => {
                        return shim.error("Bad invocation");
                    }
                );
                break;

            case "changeVehicleOwner":
                if (params.length != 2) {
                    return shim.error("Error expecting 2 arguments, Vehicle ID and new Owner");
                }

                stub.getState(params[0]).then(
                    (vehicleBytes) => {
                        return vehicleBytes.toString();
                    }
                ).catch(
                    () => {
                        return shim.error("Couldn't locate vehicle with given ID");
                    }
                ).then(
                    (vehicleString) => {
                        let vehicle = JSON.parse(vehicleString);
                        vehicle.Owner = params[1];
                        return stub.putState(params[0], Buffer.from(JSON.stringify(vehicle)));
                    }
                ).then(
                    () => { 
                        return shim.success();
                    }
                ).catch(
                    () => {
                        return shim.error("Couldn't update the vehicle with the owner");
                    }
                );
                break;

            case "queryVehicle":
                if (params.length != 1) {
                    return shim.error("Incorrect number or arguments, expecting 1.");
                }
            
                return stub.getState(params[0]).then(
                   (vehicleBytes) => { 
                       return shim.success(vehicleBytes);
                   }
                ).catch(
                    () => { 
                        return shim.error("Couldn't locate vehicle with given ID");
                    }
                );
        }
    return shim.error("Specify correct invocation method");
    }
}

shim.start(new chaincode());
