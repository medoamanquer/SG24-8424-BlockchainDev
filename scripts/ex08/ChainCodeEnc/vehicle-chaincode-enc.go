package main

/* Imports
* utility libraries and  Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"

	//// add new packages
	"github.com/hyperledger/fabric/bccsp"
	"github.com/hyperledger/fabric/bccsp/factory"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/entities"
	////
)

// Define the Smart Contract structure
type SmartContract struct {
	//// add new field
	bccspInst bccsp.BCCSP
	////
}

//// define consts
const DECKEY = "DECKEY"
const ENCKEY = "ENCKEY"
const IV = "IV"
////

/* Define Vehicle structure, with 4 properties.
Structure tags are used by encoding/json library
*/
type Vehicle struct {
	ModelType string `json:"modelType"`
	Colour    string `json:"colour"`
	Timestamp string `json:"timestamp"`
	Location  string `json:"location"`
	Owner     string `json:"owner"`
}

/*
 * The Init method *
 called when the Smart Contract "About Vehicle" is instantiated by the network
No Implementation as best to seperat in another function
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 *
 invoke called when an application requests to run the Smart Contract
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()

	//// add map for Transient data
	tMap, err := APIstub.GetTransient()
	if err != nil {
		return shim.Error(fmt.Sprintf("Could not retrieve transient, err %s", err))
	}
	////

	// execute function accroding to function name passed in parameter
	if function == "queryVehicle" {
		return s.queryVehicle(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordVehicle" {
		return s.recordVehicle(APIstub, args)
	} else if function == "changeVehicleOwner" {
		return s.changeVehicleOwner(APIstub, args)
	////
	} else if function == "queryVehicleEnc" {
		if _, in := tMap[DECKEY]; !in {
			return shim.Error(fmt.Sprintf("Expected transient decryption key %s", DECKEY))
		}
		return s.queryVehicleEnc(APIstub, args, tMap[DECKEY], tMap[IV])
	} else if function == "recordVehicleEnc" {
		if _, in := tMap[ENCKEY]; !in {
			return shim.Error(fmt.Sprintf("Expected transient encryption key %s", ENCKEY))
		}
		return s.recordVehicleEnc(APIstub, args, tMap[ENCKEY], tMap[IV])
	}
	////

	return shim.Error("Invalid Smart Contract function Call ")
}


////
func (s *SmartContract) queryVehicleEnc(APIstub shim.ChaincodeStubInterface, args []string, decKey, IV []byte) sc.Response {
	ent, err := entities.NewAES256EncrypterEntity("ID", s.bccspInst, decKey, IV)
	if err != nil {
		return shim.Error(fmt.Sprintf("entities.NewAES256EncrypterEntity failed, err %s", err))
	}

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	ciphervehicleAsBytes, _ := APIstub.GetState(args[0])
	if ciphervehicleAsBytes == nil {
		return shim.Error("Could not locate Vehicle")
	}

	vehicleAsBytes, err := ent.Decrypt(ciphervehicleAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Decrypt failed, err %+v", err))
	}

	return shim.Success(vehicleAsBytes)
}
////

////
func (s *SmartContract) recordVehicleEnc(APIstub shim.ChaincodeStubInterface, args []string, encKey, IV []byte) sc.Response {
	ent, err := entities.NewAES256EncrypterEntity("ID", s.bccspInst, encKey, IV)
	if err != nil {
			return shim.Error(fmt.Sprintf("entities.NewAES256EncrypterEntity failed, err %s", err))
	}

	if len(args) != 6 {
		return shim.Error("Error Expecting 6 arguments")
	}

	var vehicle = Vehicle{ModelType: args[1], Colour: args[2], Timestamp: args[3],Location:args[4] ,Owner: args[5]}

	vehicleAsBytes, _ := json.Marshal(vehicle)

	ciphervehicleAsBytes, err := ent.Encrypt(vehicleAsBytes)
	if err != nil {
			return shim.Error(fmt.Sprintf("Failed to encrypt data"))
	}

	err = APIstub.PutState(args[0], ciphervehicleAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record Vehicle Error: %s", args[0]))
	}

	return shim.Success(nil)
}
////


/*
 *
below function Used to view the records of one particular Vehicle
It takes one argument -- the key for the Vehicle and return Vehicle Data
*/
func (s *SmartContract) queryVehicle(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	vehicleAsBytes, _ := APIstub.GetState(args[0])
	if vehicleAsBytes == nil {
		return shim.Error("Could not locate Vehicle")
	}
	return shim.Success(vehicleAsBytes)
}

/*
 * Create Test Vehicle
 */
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	vehicle := []Vehicle{
		Vehicle{ModelType: "New Car", Colour: "Red", Timestamp: "1504054225",Location:"", Owner: "Ahmad"},
	}

	i := 0
	for i < len(vehicle) {
		vehicleAsBytes, _ := json.Marshal(vehicle[i])
		APIstub.PutState(strconv.Itoa(i), vehicleAsBytes)
		i = i + 1
	}

	return shim.Success(nil)
}

/*
 *

this method to save new vehicle

*/
func (s *SmartContract) recordVehicle(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Error Expecting 6 arguments")
	}

	var vehicle = Vehicle{ModelType: args[1], Colour: args[2], Timestamp: args[3],Location:args[4] ,Owner: args[5]}

	vehicleAsBytes, _ := json.Marshal(vehicle)
	err := APIstub.PutState(args[0], vehicleAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record Vehicle Error: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 *  changeVehicleOwner
 Change Vehicle owner using ID and new Owner as paramter
*/
func (s *SmartContract) changeVehicleOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Error Expecting 2 argument, Vehicle ID and new Owner")
	}

	vehicleAsBytes, _ := APIstub.GetState(args[0])
	if vehicleAsBytes == nil {
		return shim.Error("Could not locate Vehicle")
	}
	vehicle := Vehicle{}

	json.Unmarshal(vehicleAsBytes, &vehicle)
	// Update Owner using arg1
	vehicle.Owner = args[1]

	vehicleAsBytes, _ = json.Marshal(vehicle)
	err := APIstub.PutState(args[0], vehicleAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change Vehicle Owner : %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * main function Entry Point

 */
func main() {
	////
	factory.InitFactories(nil)
	////

	// Create a new Smart Contract
	// err := shim.Start(new(SmartContract))
	////
	err := shim.Start(&SmartContract{factory.GetDefault()})
	////
	if err != nil {
		fmt.Printf("Error creating  Smart Contract: %s", err)
	}
}
