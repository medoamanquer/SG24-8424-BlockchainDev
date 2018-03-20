#!/bin/bash
 
 source ./.env

# indent text on echo
function indent() {
  c='s/^/       /'
  case $(uname) in
    Darwin) sed -l "$c";;
    *)      sed -u "$c";;
  esac
}

# Grab the current directory
function getCurrent() 
    {
        showStep "getting current directory"
        DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
        THIS_SCRIPT=`basename "$0"`
        showStep "Running '${THIS_SCRIPT}'"
    }

# displays where we are, uses the indent function (above) to indent each line
function showStep ()
    {
        echo -e "${YELLOW}=====================================================" | indent
        echo -e "${RESET}-----> $*" | indent
        echo -e "${YELLOW}=====================================================${RESET}" | indent
    }

function printHelp ()
{
    printHeader
    echo ""
    echo -e "${RESET} options for this exec are: "
    echo -e "${GREEN}-h ${RESET}Print this help information" | indent
    echo -e "${GREEN}-n ${RESET}defaults to ${GREEN}voucher-network${RESET}. use ${YELLOW}-n your-named-network ${RESET}if you are using a different network name"  | indent
    echo -e "\t\tyou will have to ensure that the name you use here is also the name you use in BOTH package.json files and in your application code" | indent
    echo ""
    echo ""
}

# print the header information for execution
function printHeader ()
{
    echo ""
    echo -e "${RED}This has been successfully tested on OSX Sierra and Ubuntu 16.04" | indent
    echo -e "${YELLOW}This script will create your Composer archive" | indent
    echo ""
}
# get the command line options

 while getopts "h:n:" opt; 
do
    case "$opt" in
        h|\?)
        printHelp
        exit 0
        ;;
        n)  showStep "option passed for network name is: '$OPTARG'" 
            if [[ $OPTARG != "" ]]; then 
                NETWORK_NAME=$OPTARG 
            fi
        ;;
    esac
 done

printHeader
echo  "Parameters:"
echo -e "Network Name is: ${GREEN} $NETWORK_NAME ${RESET}" | indent

showStep "deploying network"

cd ../../network/dist
showStep "installing PeerAdmin card"
composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName $NETWORK_NAME
showStep "starting network"
# change in documentation
# composer network start --card PeerAdmin@hlfv11 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile $NETWORK_NAME.bna --file networkadmin.card
# corrected to: 
composer network start -c PeerAdmin@hlfv1 -A admin -S adminpw -a ./$NETWORK_NAME.bna --file ./networkadmin.card
showStep "importing networkadmin card"
if composer card list -n admin@$NETWORK_NAME > /dev/null; then
    composer card delete -n admin@$NETWORK_NAME
fi
composer card import --file networkadmin.card
showStep "pinging admin@$NETWORK_NAME card"
composer network ping --card admin@$NETWORK_NAME


