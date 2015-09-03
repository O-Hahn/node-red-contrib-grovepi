/**
 * Copyright 2015 IBM Corp.
 * Author: Olaf Hahn
 *
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
 **/


// Node extensions for displaying the connection status
function connectingStatus(n){
  n.status({fill:"red",shape:"ring",text:"connecting"});
}

function networkReadyStatus(n){
  n.status({fill:"yellow",shape:"ring",text:"connecting..."});
}

function networkErrorStatus(n){
  n.status({fill:"red",shape:"dot",text:"disconnected"});
}

function ioErrorStatus(n, err){
  n.status({fill:"red",shape:"dot",text:"error"});
  n.warn(err);
}

function connectedStatus(n){
  n.status({fill:"green",shape:"dot",text:"connected"});
}

// Main 
module.exports = function(RED) {
    "use strict";
	
    function GrovePiSensorNode(config) {
        RED.nodes.createNode(this,config);
        this.pin = config.pin;
        this.sensor = config.sensor;
        this.name = config.name;
        
        // Retrieve the board-config node
        this.boardConfig = RED.nodes.getNode(config.board);
 
        var n = this;
        
        if (n.boardConfig) {
            // Every Pin could only used once for a device
            var i;
            var found;
            var len; 
        	for (i = 0, found=-1, len = n.boardConfig.usedPins.length; i < len; i++) {
        	    if (n.boardConfig.usedPins[i] == n.pin) {
        	    	found = i;
        	    }
        	}
        	if (found == -1) {
        		n.boardConfig.usedPins.push(n.pin);
        		connectingStatus(n);
        	} else {
        		n.error("Sensor " + n.sensor + ": Pin already in use: " + n.pin);
        		ioErrorStatus(n);
        	}
        	n.log ("Sensor " + n.sensor + ": is bound to Pin " + n.pin);	
        } else {
            // No config node configured
    		ioErrorStatus(n);
        	n.error ("Node has no Board configuration!");
        }
          
        // Establish Function for Input Event
        n.on('input', function(msg) {
            n.log("Node with Sensor " + n.sensor + " on Pin " + n.pin + "is listening")
            msg.payload = msg.payload.toLowerCase() + " Pin " + n.pin;
            connectedStatus(n);
            n.send(msg);
        });
    }
    RED.nodes.registerType("grovepi-sensor-node",GrovePiSensorNode);

    function BoardConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.boardType = n.boardType;
        this.name = n.name;
        this.usedPins = [];
    }
    RED.nodes.registerType("board-config",BoardConfigNode);
}
