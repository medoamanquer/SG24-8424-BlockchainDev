# Hyperledger Fabric Security, and User Management
This module explains how to interact with the security concepts in Hyperledger Fabric in general. The main focus is the joint interaction of "fabric-client" with "fabric-ca-client" & "composer-client" which are all Node.JS modules.
<br>
The plan is to provide an over view of how to leverage the tools to compose the credentials of a user; and explain what set of the credentials are; and how to leverage these credentials either to interact with: Fabric (as protocol) / composer-module (Runtime on top of Fabric).
<br>

# Section 1: Enrolling a User (Admin User) w/ Fabric Client with Fabric CA Client
The first user we probably would like to enroll is the "Admin" user that will have direct interaction with the Certificate Authority component of the network that issues the credentials (enrollment certificates), that will be usually refferred to as "ecerts". The process depends mainly on whats known as the key store (hfc-key-store); this folder is the store that stores 3 types of files: "Context file", "Public Key", and "Private Key" for each user. 
<br>
## N.B.
Please take into consideration that we will be using the host file system as a store to our credentials in the development environment, and our focus is mainly on how to represent the interaction of the tools.
<br>

## N.B.
Please take into consideration that we will assume the url of the "Fabric-CA" to be listening on port 7054 of the host machine as "localhost".
<br>

### Refer to enrollAdmin.js script sourced from official samples
<br>
The procedure of the script is very specific:
<br>
1. Allocate a keystore path which is assumed to be on the local file system, followed by setting up the crypto store & crypto suite.
<br>
2. Setup a connection with Fabric CA with no root CA verification in TLS options in order to establish a first time connection with the CA.
<br>
3. Disregarding the dummy check, the basic enrollment process is done via an enrollment ID & Secret.
<br>
4. The CA responds back with a Private Key & Certificate which are the credentials that represent an identity in Hyperledger Fabric.
<br>
5. Create the user structure, and embedding the proper affiliation the admin user belongs to.
<br>
6. Set the proper context for the user as admin user belonging to Org1MSP.
<br>

# Section 2: Enrolling a USER (Member User) w/ Fabric Client with Fabric CA Client
As an admin of an organization; the admin would like to start registering users that will interact with the Fabric network.
<br>
### Refer to registerUser.js script sourced from official samples
<br>
The procedure of the script is very specific:
<br>
1. Capture the identity of the admin in order to leverage it to enroll new user.
<br>
2. Enroll the user with an enrollment ID & proper affiliation.
<br>
3. The CA responds back with proper enrollment secret.
<br>
4. Create the user structure, and embedding the proper affiliation the user belongs to.
<br>
5. Set the proper context for the user as member belonging to Org1MSP.
<br>

## Summary
So far we have user credentials whether admin/member; in the next section we will explore how to create Composer Business Network Card out of the credentials.
<br>

# Section 3: Create composer card with a local store on file system
<br>
Many solutions are available via the "Composer Module" which is a part of the Hyperledger Project, and in this section the main focus is leveraging the capabilities of the fabric sdk with composer sdk in order to create a composer card for the previously enrolled admin.
<br>
## N.B.
<br>
The connection profile for composer cards is assumed to be for the common setup for development process according to Hyperledger Composer samples.
<br>

### Refere to createComposerCards.js script
<br>
The procedure of the script is very specific:
<br>
1. Setup proper paths & modules.
<br>
2. Fetch the enrolled "admin" from the local 'hfc-key-store'.
<br>
3. Create a composer card with these credentials.
<br>
4. Store the composer in the local defined store.