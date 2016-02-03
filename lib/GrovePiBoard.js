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

// Modules needed
var GrovePi = require('node-grovepi').GrovePi;

// Global Vars
var initWait  = 1     // in seconds

// Global Constants
var ADDRESS   = 0x04

var STATE_UNINITIALISED = 0;
var STATE_INITIALISED   = 1;

// Module GrovePiBoard
 var GrovePiBoard = function() {
	 
   this.state = this.state || STATE_UNINITIALISED;
   
   if(this.state == STATE_UNINITIALISED){
	   this.board = this.init.apply(this);
	   this.commands = GrovePi.commands;
	   this.state = STATE_INITIALISED;

	   console.log('GrovePiBoard is now initialized');
   }
 };

// Init the GrovePi Board 
GrovePiBoard.prototype.init = function() {
   var board = new GrovePi.board({
     debug: true,
     onError: function(err){
       console.error('GrovePiBoard.js: Something went wrong');
       console.error(err)
     },
     onInit: function(res) {
     }
   });
   
   board.init();
   
   return board;
};

// Register a Sensor
GrovePiBoard.prototype.registerSensor = function(sensorType, sensorSubType, pin, repeat, callback) {
	// Register analog Sensor from GrovePi
	if(sensorType == 'analog'){
		var self = this;
		var interval =  setInterval( function(){
			var value = self.readAnalogSensor.apply(self,[pin] );
			callback(value);
			}, repeat * 1000);
		
		return function(callback){
		       clearInterval(interval);
		       calllback();
		     }
		
	// Register digital Sensor from GrovePi 
	} else if(sensorType == 'digital'){
		var self = this;
		
		// Button Sensor 
		if(sensorSubType == 'button'){
			var interval = setInterval(function(){
				var value = self.readButtonSensor.apply(self, [pin]);
				callback(value);
				}, repeat * 1000);
		
		// Sound Sensor	
		} else if(sensorSubType == 'sound'){
		     var interval = setInterval(function(){
		        var value = self.readSoundSensor.apply(self, [pin]);
		        callback(value);
		        }, repeat * 1000);
	    
		     // Ultrasonic Sensor
		} else if(sensorSubType == 'ultrasonic'){
			var interval = setInterval(function(){
				var value = self.readUltrasonicSensor.apply(self, [pin]);
				callback(value);
				}, repeat * 1000);
	    
	    // Temp and Humunity Sensor 
		} else if(sensorSubType == 'temphum'){
			var interval = setInterval(function(){
				var value = self.readDHTSensor.apply(self, [pin]);
		        callback(value);
		        }, repeat *1000);
		}
     
		return function(callback){
		       clearInterval(interval);
		       calllback();
		     }
		}
};
 
 // readButtonSensor
 GrovePiBoard.prototype.readButtonSensor = function(pin) {
	 var buttonSensor = new GrovePi.sensors.base.Digital(pin);
	 var reading = buttonSensor.read();
	 return reading;
 };

 // readSoundSensor
 GrovePiBoard.prototype.readSoundSensor = function(pin) {
   // Not sure how to do this yet
   var reading = {};
   reading.value = "Unknown";
   return reading;
 };

 // readUltrasonicSensor
 GrovePiBoard.prototype.readUltrasonicSensor = function(pin) {
   var ultrasonicSensor = new GrovePi.sensors.UltrasonicDigital(pin);
   var reading = ultrasonicSensor.read();
   return reading;
 };

 // readDHTSensor
 GrovePiBoard.prototype.readDHTSensor = function(pin){
   var dhtSensor = new GrovePi.sensors.DHTDigital(pin);
   var reading = dhtSensor.read();
   var ret = {};
   
   ret.temperature = reading[0];
   ret.humdity = reading[1];
   ret.heatIndex = reading[2];
   
   return formatted;
 };

 // 
 GrovePiBoard.prototype.input = function(actuator, pin, state){
	 if (actuator == 'led') {
		 this.board.writeBytes(this.commands.dWrite.concat([pin, state, this.commands.unused]));		 
	 } else if (actuator == 'lcd') {
		 
	 } else if (actuator == 'relay') {
		 
	 }
 };

 // readAnalogSensor
 GrovePiBoard.prototype.readAnalogSensor = function(pin, length){
   if(typeof length == 'undefined'){
     length - this.board.BYTESLEN;
   }
   
   var writeRet = this.board.writeBytes(this.commands.aRead.concat([pin, this.commands.unused, this.commands.unused]));
   
   if(writeRet){
     this.board.readByte();
     var bytes = this.board.readBytes(length);
     if(bytes instanceof Buffer) {
       return bytes[1] * 256 + bytes[2]
     } else {
       return false;
     }
   } else {
     return false;
   }
 };

// Close
GrovePiBoard.prototype.close = function() {
	console.log("Close Function called")
};

 
//export the class
module.exports = GrovePiBoard;

