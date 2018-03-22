# Introduction
Encryption is sometimes essential to protect user data; this tutorial is based on one of the official examples within "Fabric Samples"; the reuse is intended in order to provide a code reuse for the course labs; and it would be a great idea to extend the "byfn" example.
<br>
## N.B
It's advised to demonstrate this on the byfn example in order to demonstrate the channel separation/grouping for chaincodes.
<br>
# The Journey
This sample exercise will enable the learner to explore the following:
<br>
1. The channel data grouping on the world state by accessing the couchDB instance.
<br>
2. Vendoring additional packages in chaincode.
<br>
3. Basic data encryption.
<br>
4. Writing a sample programmatic rule.
<br>

# Pre-requisites
In order to attempt this exercise, one should have the following pre-requisites:
<br>
1. Golang setup properly with "GOPATH"; and fabric source code is within that path.
<br>
2. "fabric samples" from the official documentation in order to extend the "byfn" scenario.
<br>
3. All environment pre-requisites are encouraged (Docker, etc..), for further elaboration if needed.
<br>
4. Go package application (govendor).
<br>

# How to start the exercise
Within Fabric Source code; make a new folder for our sample deployment chaincode. 
<br>

    cd examples/chaincode/go
    mkdir encrypted_car_manufacturing

copy the contents of the "enccc_example" into this folder
<br>

    cp enccc_example/* encrypted_car_manufacturing
    cd encrypted_car_manufacturing

Copy the following snippet within the code:
<br>
    
    // get arguments and transient
	f, args := stub.GetFunctionAndParameters()
	tMap, err := stub.GetTransient()
	var Customer, VehicleID string // This is a new snippet

Add the required business rules in those lines as well:
<br>
    
    case "ENCRYPT":
		// make sure there's a key in transient - the assumption is that
		// it's associated to the string "ENCKEY"
		if _, in := tMap[ENCKEY]; !in {
			return shim.Error(fmt.Sprintf("Expected transient encryption key %s", ENCKEY))
		}
        // New snippet
		Customer = args[0] 
		VehicleID = args[1]
		if (!strings.HasPrefix(VehicleID,"vehicle")) {
			return shim.Error(fmt.Sprintf("The entry is not abided by the business rule of vehicleID prefixed by vehicle."))
		}
		if (!strings.HasPrefix(Customer,"customer")) {
			return shim.Error(fmt.Sprintf("The entry is not abided by the business rule of vehicleID prefixed by customer."))
		}
        // Snippet ends here
		return t.Encrypter(stub, args[0:], tMap[ENCKEY], tMap[IV])

<br>
Add the other required business rules in those lines as well:
<br>

    // make sure keys are there in the transient map - the assumption is that they
		// are associated to the string "ENCKEY" and "SIGKEY"
		if _, in := tMap[ENCKEY]; !in {
			return shim.Error(fmt.Sprintf("Expected transient key %s", ENCKEY))
		} else if _, in := tMap[SIGKEY]; !in {
			return shim.Error(fmt.Sprintf("Expected transient key %s", SIGKEY))
		}
        // New snippet
		Customer = args[0]
		VehicleID = args[1]
		if (!strings.HasPrefix(VehicleID,"vehicle")) {
			return shim.Error(fmt.Sprintf("The entry is not abided by the business rule of vehicleID prefixed by vehicle."))
		}
		if (!strings.HasPrefix(Customer,"customer")) {
			return shim.Error(fmt.Sprintf("The entry is not abided by the business rule of vehicleID prefixed by customer."))
		}
        // Snippet ends here
		return t.EncrypterSigner(stub, args[0:], tMap[ENCKEY], tMap[SIGKEY])

<br>
These are two dummy rules that enforce customerID (the key entry) to start with (customer), and the vehicleID (the value) to start with (vehicle).
the key is not encrypted; but the the vehicleID as string will be encrypted, and here we assume the vehicleID is a sensitive information.
<br>
Now the code is ready, and we are ready to move onto the next step of vendoring.
<br>

# Vendor the packages
Following the same manner of the "enccc_example" through the official examples; we vendor the code using govendor.
<br>
    
    govendor init
    govendor add +externals

<br>

Now everything should be properly setup.
<br>

# Deploy the chaincode
Deployment options are varying here; either you deploy using SDK or CLI. CLI is suggested especially for gaining more interaction with the environment, and as well to follow the reference example in case of issue for the learner; it should be easier for the community to help with debugging issues, etc.. if a common procedure being followed.

### Procedure

1. Copy the packaged folder into "fabric-samples" in the chaincode folder.
<br>
2. The chaincode is now accessible through the "byfn" example.
<br>
3. Deploy the chaincode as normal procedure with a proper name and version.
<br>
4. Interact with the chaincode through the CLI.

### Interaction snippets based on the official enccc_example

Initialize encryption & decryption keys

    ENCKEY=`openssl rand 32 -base64` && DECKEY=$ENCKEY

Invoke the chaincode, assume the name as enccc and channel is my-c, in the lab; please provide the best fit scenario.

    peer chaincode invoke -n enccc -C my-ch -c '{"Args":["ENCRYPT","customer1","vehicle1"]}' --transient "{\"ENCKEY\":\"$ENCKEY\"}" 

Make sure you have the value again

    peer chaincode query -n enccc -C my-ch -c '{"Args":["DECRYPT","customer1"]}' --transient "{\"DECKEY\":\"$DECKEY\"}"

Now you can pretty much anything as you want with this sample.

# 
