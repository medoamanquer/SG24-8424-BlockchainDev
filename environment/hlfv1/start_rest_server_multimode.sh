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
    echo -e "${GREEN}-n ${RESET}defaults to ${GREEN}${NETWORK_NAME}${RESET}. use ${YELLOW}-n your-named-network ${RESET}if you are using a different network name"  | indent
    echo -e "\t\tyou will have to ensure that the name you use here is also the name you use in BOTH package.json files and in your application code" | indent
    echo ""
    echo ""
}

# print the header information for execution
function printHeader ()
{
    echo ""
    echo -e "${GREEN}This has been tested on Mac OSX thru High Sierra and Ubuntu V16 LTS" | indent
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


showStep "testing rest server \n when this completes, \n  go to your favorite browser \n and enter localhost:3000/explorer "
# original (pre V0.14)
# composer-rest-server -p hlfv1 -n $NETWORK_NAME -i PeerAdmin -s randomString
# V0.14
export COMPOSER_PROVIDERS='{
  "github": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "32772fbc7989ae4aae93",
    "clientSecret": "d5ffa06afb2ea961bb8ce4af530576ec1db09991",
    "authPath": "/auth/github",
    "callbackURL": "/auth/github/callback",
    "successRedirect": "/",
    "failureRedirect": "/"
  }
}'
npm install -g passport-github
composer-rest-server -c admin@$(NETWORK_NAME) -w -a true -m true 
