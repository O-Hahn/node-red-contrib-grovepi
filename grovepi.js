/**
 * Copyright 2015 IBM Corp.
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
 * Authors:
 *    - Olaf Hahn
 **/


module.exports = function(RED) {
    "use strict";
    var GrovePiBoard = require('./lib/GrovePiBoard');

    // Analog Sensor Node 
    function GrovePiAnalogSensorNode(config) {
        RED.nodes.createNode(this,config);
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.sensor = config.sensor;
       this.repeat = config.repeat;
       if (RED.settings.verbose) { this.log("Analog Sensor: Pin: " + this.pin + ", Repeat: " + this.repeat); }

       var node = this;

        if(node.boardConfig){
          // Board has been initialised
          if(!node.boardConfig.board){
            node.boardConfig.board = new GrovePiBoard();
            node.boardConfig.board.init();
          }

          // Board has been initialised
     	 if (RED.settings.verbose) { this.log("GrovePiAnalogSensor: Configuration Found"); }
          
          this.sensor = node.boardConfig.board.registerSensor('analog', this.sensor, this.pin, this.repeat, function(response){
              var msg = {};
              
              node.status({fill:"green",shape:"dot",text:"connected"});
              msg.payload = response;
              
              if (RED.settings.verbose) { node.log("AnalogSensor value: " + response); }
              
              node.send(msg);
          });

          this.on('close', function(done) {             
              this.sensor(function(){
                  done();
              });
              if (node.done) {
                  node.status({});
                  node.done();
              }
              else { node.status({fill:"red",shape:"ring",text:"stopped"}); }
          });


        } else {
          node.error("Node has no configuration!");
          node.status({fill:"red",shape:"ring",text:"error"});
      }
    }
    RED.nodes.registerType("grove analog sensor",GrovePiAnalogSensorNode);

    // DigitalSensoreNode (Temp/Hum, ..)
    function GrovePiDigitalSensorNode(config) {
    	// Create this node
        RED.nodes.createNode(this,config);
        
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.sensor = config.sensor;
       this.repeat = config.repeat;
       if (RED.settings.verbose) { this.log("Digital Sensor: Pin: " + this.pin + ", Repeat: " + this.repeat); }

       var node = this;

       if(node.boardConfig){
         if(!node.boardConfig.board){
           node.boardConfig.board = new GrovePiBoard();
           node.boardConfig.board.init();
         }

         // Board has been initialised
    	 if (RED.settings.verbose) { this.log("GrovePiDigitalSensor: Configuration Found"); }
         
         this.sensor = node.boardConfig.board.registerSensor('digital', this.sensor, this.pin, this.repeat, function(response) {
        	 var msg = {};
       
       	  	 node.status({fill:"green",shape:"dot",text:"connected"});
             msg.payload = response;
             if (RED.settings.verbose) { node.log("DigitalSensor value: " + response); }
             
             node.send(msg);
         });

         this.on('close', function(done) {
            this.sensor(function(){
                 done();
             });
            if (node.done) {
                node.status({});
                node.done();
            }
            else { node.status({fill:"red",shape:"ring",text:"stopped"}); }
         });

       } else {
         node.error("Node has no configuration!");
         node.status({fill:"red",shape:"ring",text:"error"});
       }
    }
    RED.nodes.registerType("grove digital sensor",GrovePiDigitalSensorNode);

    // DigitalEventSensoreNode (Button, ..)
    function GrovePiDigitalEventSensorNode(config) {
    	// Create this node
        RED.nodes.createNode(this,config);
        
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.sensor = config.sensor;
       if (RED.settings.verbose) { this.log("Digital Eventbased Sensor: Pin: " + this.pin); }

       var node = this;

       if(node.boardConfig){         
         if(!node.boardConfig.board){
           node.boardConfig.board = new GrovePiBoard();
           node.boardConfig.board.init();
         }

         // Board has been initialised
    	 if (RED.settings.verbose) { this.log("GrovePiEventSensor: Configuration Found"); }
         
         this.sensor = node.boardConfig.board.registerSensorEvent('digital', this.sensor, this.pin, function(response) {
        	 var msg = {};
       
       	  	 node.status({fill:"green",shape:"dot",text:"connected"});
             msg.payload = response;
             if (RED.settings.verbose) { node.log("DigitalSensor value: " + response); }
             
             node.send(msg);
         });

         this.on('close', function(done) {
            this.sensor(function(){
                 done();
             });
            if (node.done) {
                node.status({});
                node.done();
            }
            else { node.status({fill:"red",shape:"ring",text:"stopped"}); }
         });

       } else {
         node.error("Node has no configuration!");
         node.status({fill:"red",shape:"ring",text:"error"});
       }
    }
    RED.nodes.registerType("grove digital event",GrovePiDigitalEventSensorNode);

    
    // DigitalOutputNode (Led,..)
    function GrovePiDigitalOutputNode(config) {
        RED.nodes.createNode(this,config);
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.log("DigitalOutput: Pin: " + this.pin);

       var node = this;

       if(node.boardConfig){
         // Board has been initialised
         if(!node.boardConfig.board){
           node.boardConfig.board = new GrovePiBoard();
           node.boardConfig.board.init();
         }

         // Board has been initialised
    	 if (RED.settings.verbose) { this.log("GrovePiDigitalOutput: Configuration Found"); }
         
         this.on('input', function(msg) {
        	 node.status({fill:"green",shape:"dot",text:"connected"});
             if (RED.settings.verbose) { node.log("DigitalOutput on " + this.pin + " value: " + msg.payload); }
             node.boardConfig.board.digitalOutput(this.pin, msg.payload);
          });

         this.on('close', function(done) {
             this.sensor(function(){
                 done();
             });
             if (node.done) {
                 node.status({});
                 node.done();
             }
             else { node.status({fill:"red",shape:"ring",text:"stopped"}); }
         });

       } else {
         node.error("Node has no configuration!");
         node.status({fill:"red",shape:"ring",text:"error"});
       }
    }
    RED.nodes.registerType("grove digital output",GrovePiDigitalOutputNode);

    // LcdRGBOutputNode (LCD,..)
    function GrovePiLcdRGBOutputNode(config) {
    	// Create this node
        RED.nodes.createNode(this,config);
        
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.log("LcdRGBOutput: I2C-Pin: " + this.pin);

       var node = this;

       if(node.boardConfig){
         // Board has been initialised
         if(!node.boardConfig.board){
           node.boardConfig.board = new GrovePiBoard();
           node.boardConfig.board.init();
         }

         // Board has been initialised
    	 if (RED.settings.verbose) { this.log("GrovePiLcdRGBOutput: Configuration Found"); }
         
         this.on('input', function(msg) {
        	  node.status({fill:"green",shape:"dot",text:"connected"});
              node.boardConfig.board.lcdRGBOutput(this.pin, msg);
              if (RED.settings.verbose) { node.log("LcdRGBOutput on " + this.pin + " value: " + msg.payload.text); }
          });

         this.on('close', function(done) {
             node.status({});
             this.sensor(function(){
                 done();
             });
             if (node.done) {
                 node.status({});
                 node.done();
             }
             else { node.status({fill:"red",shape:"ring",text:"stopped"}); }
         });

       } else {
         node.error("Node has no configuration!");
         node.status({fill:"red",shape:"ring",text:"error"});
       }
    }
    RED.nodes.registerType("grove lcdrgb output",GrovePiLcdRGBOutputNode);

    // GrovePi Configuration Node 
    function GrovePiConfigNode(n) {
       // Create this node
       RED.nodes.createNode(this,n);
       
       this.boardType = n.boardType;
       this.name = n.name;
   }
   RED.nodes.registerType("board-config",GrovePiConfigNode);
}
