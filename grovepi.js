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
 *    - James Sutton
 **/
module.exports = function(RED) {
    "use strict";
    var GrovePiBoard = require('./lib/GrovePiBoard');

    // 
    function GrovePiAnalogSensorNode(config) {
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

    // DigitalSensoreNode (Temp/Hum, ..)
    function GrovePiDigitalSensorNode(config) {
    	// Create this node
        RED.nodes.createNode(this,config);
        
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.sensor = config.sensor;
       this.repeat = config.repeat;
       this.log("Digital Sensor: Sensor: " + this.sensor + ", Pin: " + this.pin + ", Repeat: " + this.repeat);

       var node = this;

       if(node.boardConfig){
         // Board has been initialised
         this.log("Configuration Found")
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
         }

         this.on('input', function(msg) {
              node.boardConfig.board.digitalOutput(this.pin, msg.payload);
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
         }

         this.on('input', function(msg) {
              node.boardConfig.board.lcdRGBOutput(this.pin, msg.payload);
              node.log("text" + msg.payload.text);
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
    RED.nodes.registerType("grove lcdrgb output",GrovePiLcdRGBOutputNode);

    // GrovePi Configuration Node 
    function GrovePiConfigNode(n) {
       // Create this node
       RED.nodes.createNode(this,n);
       
       this.boardType = n.boardType;
       this.name = n.name;
       this.usedPins = [];
   }
   RED.nodes.registerType("board-config",GrovePiConfigNode);
}
