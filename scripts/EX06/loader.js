const logger = require('log4js').getLogger('loader.js');
const fs = require('fs');
const path = require('path');
const util = require('util');
const _ = require('lodash');
const fileExtension = require('file-extension'); 

logger.setLevel(process.env.LOGLEVEL || 'info');

module.exports = (configDirectory) => {
    let helper = {};
    helper.profiles = new Map();

    helper.getOrganizationId = (cfg) => {
        return cfg.client.organization;
    };

    helper.getAllOrganizationIds = () => {
        let orgs = [];
        let profiles = helper.profiles.keys();
        
        for (let i = 0; i < helper.profiles.size; i++) {
            orgs.push(profiles.next().value);
        }
        return orgs;
    }

    helper.getPeersNameForOrgAndChannel = (org, ch) => {
        const orgProfile = helper.profiles.get(org);
        const channel = orgProfile.channels[ch];
        if (channel && channel.peers) {
            const peers = Object.keys(channel.peers);
            if (peers) {
                return peers;
            } else {
                logger.error('No peers found');
            }
        }
        throw new Error('Channel not found or no peers in the channel: ', ch);
    };

    helper.getPeerForOrg = (org, peerName) => {
        const orgProfile = helper.profiles.get(org);
        const peer = orgProfile.peers[peerName]
        if (peer) {
            peer.name = peerName;
            return peer;
        } else {
            throw new Error(`Peer '${peerName}'not found`);
        }
    };

    helper.getPeersForOrgAndChannel = (org, ch) => {
        const peerNames = helper.getPeersNameForOrgAndChannel(org, ch);

        if (peerNames) {
            let peers = [];
            peerNames.forEach(peerName => {
                peers.push(helper.getPeerForOrg(org, peerName));
            });
            return peers;
        } else {
            throw new Error(`Peers not found for the channel '${ch}'`);
        }
    };

    helper.getOrderersNameForOrgAndChannel = (org, ch) => {
        const orgProfile = helper.profiles.get(org);
        const channel = orgProfile.channels[ch];
        if (channel && channel.orderers) {
           return channel.orderers;
        }
        throw new Error('Channel not found or no orderers in the channel: ', ch);
    };

    helper.getOrdererForOrg = (org, ordererName) => {
        const orgProfile = helper.profiles.get(org);
        const orderer = orgProfile.orderers[ordererName]
        if (orderer) {
            orderer.name = ordererName;
            return orderer;
        } else {
            throw new Error(`Orderer '${ordererName}'not found`);
        }
    };

    helper.getOrderersForOrgAndChannel = (org, ch) => {
        const ordererNames = helper.getOrderersNameForOrgAndChannel(org, ch);

        if (ordererNames) {
            let orderers = [];
            ordererNames.forEach(ordererName => {
                orderers.push(helper.getOrdererForOrg(org, ordererName));
            });
            return orderers;
        } else {
            throw new Error(`Orderers not found for the channel '${ch}'`);
        }
    };

    helper.getUniquePeersForChannel = (ch) => {
        let peers = [];

        let profiles = helper.profiles.keys();

        for (let i = 0; i < helper.profiles.size; i++) {
            org = profiles.next().value;

            var orgPeers = helper.getPeersForOrgAndChannel(org, ch);

            for (let i = 0; i < orgPeers.length; i++) {
                peers.push(orgPeers[i]);
            }
        }

        peers = _.uniqBy(peers, 'url');

        return peers;
    }

    helper.getUniqueOrderersForChannel = (ch) => {
        let orderers = [];

        let profiles = helper.profiles.keys();

        for (let i = 0; i < helper.profiles.size; i++) {
            org = profiles.next().value;

            var orgOrderers = helper.getOrderersForOrgAndChannel(org, ch);

            for (let i = 0; i < orgOrderers.length; i++) {
                orderers.push(orgOrderers[i]);
            }
        }

        orderers = _.uniqBy(orderers, 'url');

        return orderers;
    }

    helper.getCASNamesForOrg = (org) => {
        const orgProfile = helper.profiles.get(org);
        const CASNames = orgProfile.organizations[org].certificateAuthorities;

        if (CASNames) {
            return CASNames;
        } else {
            throw new Error(`Organization not found or no CAs in the organization: ${org}`);
        }
    };

    helper.getCA = (org, CAName) => {
        const orgProfile = helper.profiles.get(org);
        const CA = orgProfile.certificateAuthorities[CAName]
        if (CA) {
            CA.orgName = org;
            return CA;
        } else {
            throw new Error(`Certificate Authority '${CAName}'not found`);
        }
    }

    helper.getCASForOrg = (org) => {
        const CASNames = helper.getCASNamesForOrg(org);

        if (CASNames) {
            let CAS = [];
            CASNames.forEach(CAName => {
                CAS.push(helper.getCA(org, CAName));
            });
            return CAS;
        }  else {
            throw new Error(`Certificate Authorities not found for Organization ${org}`);
        }
    }

    let configPaths = fs.readdirSync(configDirectory);

    logger.debug(`Loading the following files: ${configPaths}`);

    for (let configPath of configPaths) {
        //check if the extension is json. If not, then skip
        if (fileExtension(configPath) === 'json') {
            let config = require(path.join(`${configDirectory}/${configPath}`));
            let org = helper.getOrganizationId(config);
            helper.profiles.set(org, require(path.join(`${configDirectory}/${configPath}`)));
        }
    }

    logger.debug(`Loaded the following config: ${util.inspect(helper, { depth: null })}`);
    
    return helper;
};