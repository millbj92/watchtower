// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WatchtowerLogger {
    event IncidentLogged(bytes32 indexed incidentHash, uint256 timestamp, address reporter);

    function logIncident(bytes32 incidentHash, uint256 timestamp) public {
        emit IncidentLogged(incidentHash, timestamp, msg.sender);
    }
}
