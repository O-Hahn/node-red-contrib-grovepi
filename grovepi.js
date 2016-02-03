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

// Modules


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



module.exports = function(RED) {
    "use strict";
    var GrovePiBoard = require('./lib/GrovePiBoard');

    // AnalogSensorNode
    function GrovePiAnalogSensorNode(config) {
		// create this node
		RED.nodes.createNode(this,config);
       
	   // Retrieve the board-config node
	   this.boardConfig = RED.nodes.getNode(config.board);
	   this.pin = config.pin;
	   this.repeat = config.repeat;
	   this.log("Analog Sensor: Pin: " + this.pin + ", Repeat: " + this.repeat);

       var node = this;

        if(node.boardConfig){
          // Board has been initialised
          if(!node.boardConfig.board){
        	  node.boardConfig.board = new GrovePiBoard();
          }

          this.sensor = node.boardConfig.board.registerSensor('analog', null, this.pin, this.repeat, function(response){
        	  var msg = {};	
              msg.payload = response;
              node.send(msg);
          });

          this.on('close', function(done) {
              this.sensor(function(){
                  done();
              });
          });

          node.boardConfig.board.init();

        } else {
          node.error("Node has no configuration!");
        }
    }
    RED.nodes.registerType("grove analog sensor",GrovePiAnalogSensorNode);

    // DigitalSensorNode
    function GrovePiDigitalSensorNode(config) {
        // create this node
    	RED.nodes.createNode(this,config);

       // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.sensor = config.sensor;
       this.repeat = config.repeat;
       this.log("Digital Sensor: Sensor: " + this.sensor + ", Pin: " + this.pin + ", Repeat: " + this.repeat);

       var node = this;

       if(node.boardConfig){
         // Board has been initialized
         if(!node.boardConfig.board){
           node.boardConfig.board = new GrovePiBoard();
         }

         this.sensor = node.boardConfig.board.registerSensor('digital', this.sensor, this.pin, this.repeat, function(response){
             var msg = {};
             msg.payload = response;
             node.send(msg);
         });

         this.on('close', function(done) {
            this.sensor(function(){
                 done();
             });
         });

         node.boardConfig.board.init();

       } else {
         node.error("Node has no configuration!");
       }
    }
    RED.nodes.registerType("grove digital sensor",GrovePiDigitalSensorNode);

    // OutputNode
    function GrovePiOutputNode(config) {
       // create this node
       RED.nodes.createNode(this,config);
       
       // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.output = config.output;
       this.pin = config.pin;
       this.repeat = config.repeat;
       this.log("Output: Pin: " + this.pin);

       var node = this;

       if(node.boardConfig){
         // Board has been initialised
         if(!node.boardConfig.board){
           node.boardConfig.board = new GrovePiBoard();
         }

         this.on('input', function(msg) {
              node.boardConfig.board.input(this.output, this.pin, msg.payload);
          });

         this.on('close', function(done) {
             this.sensor(function(){
                 done();
             });
         });

         node.boardConfig.board.init();

       } else {
         node.error("Node has no configuration!");
       }
    }
    RED.nodes.registerType("grove output",GrovePiOutputNode);

    // ConfigurationNode 
    function GrovePiConfigNode(n) {
    	// create this config node
    	RED.nodes.createNode(this,n);
       
    	this.boardType = n.boardType;
    	this.name = n.name;
    	this.usedPins = [];
   }
   RED.nodes.registerType("board-config",GrovePiConfigNode);
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
      
        if (typeof n.boardConfig  === "object") {
        	n.log("Configuration Node exists")
        	
        	// Check if Board has been initialized
        	if (typeof n.boardConfig.groveBoard === null) {
        		n.log("grovePiBoard has been configured before")
        	} else {
        		n.log("grovePiBoard will now be configured")
        		n.boardConfig.groveBoard = new Board();
        		n.log("grovePiBoard will now be initalized")
        		n.boardConfig.groveBoard.init();
        	}
       
        	// 

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
        	          	
            // Establish Function for Input Event
            n.on('input', function(msg) {
                connectedStatus(n);
                n.log("Node with Sensor " + n.sensor + " on Pin " + n.pin + " is listening")
                msg.payload = msg.payload.toLowerCase() + " Pin " + n.pin;
                n.send(msg);
            });

        } else {
            // No config node configured
    		ioErrorStatus(n);
        	n.error ("Node has no Board configuration!");
        }        
    }
    RED.nodes.registerType("grovepi-sensor-node",GrovePiSensorNode);

    function BoardConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.boardType = n.boardType;
        this.name = n.name;
        this.usedPins = [];
        this.groveBoard = null;
    }
    RED.nodes.registerType("board-config",BoardConfigNode);
}
