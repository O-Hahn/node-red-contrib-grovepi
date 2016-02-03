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
 **/

// import GrovePi implementation from DexterIndustries
var GrovePi = require('node-grovepi').GrovePi;
var i2c = require('../node_modules/node-grovepi/node_modules/i2c-bus/i2c-bus');
var sleep = require('../node_modules/node-grovepi/node_modules/sleep/');

// Statics
var STATE_UNINITIALISED = 0;
var STATE_INITIALISED   = 1;

var DISPLAY_RGB_ADDR = 0x62;
var DISPLAY_TEXT_ADDR = 0x3e;


function setRGB(i2c1, r, g, b) {
	i2c1.writeByteSync(DISPLAY_RGB_ADDR,0,0)
	i2c1.writeByteSync(DISPLAY_RGB_ADDR,1,0)
	i2c1.writeByteSync(DISPLAY_RGB_ADDR,0x08,0xaa)
	i2c1.writeByteSync(DISPLAY_RGB_ADDR,4,r)
	i2c1.writeByteSync(DISPLAY_RGB_ADDR,3,g)
	i2c1.writeByteSync(DISPLAY_RGB_ADDR,2,b)
};

function textCommand(i2c1, cmd) {
	i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
};

function setText(i2c1, text) {
  textCommand(i2c1, 0x01) // clear display
  sleep.usleep(50000);
  textCommand(i2c1, 0x08 | 0x04) // display on, no cursor
  textCommand(i2c1, 0x28) // 2 lines
  sleep.usleep(50000);
  var count = 0;
  var row = 0;
  for(var i = 0, len = text.length; i < len; i++) {
    if(text[i] === '\n' || count === 16) {
      count = 0;
      row ++;
        if(row === 2)
          break;
      textCommand(i2c1, 0xc0)
      if(text[i] === '\n')
        continue;
    }
    count++;
    i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x40, text[i].charCodeAt(0));
  }
};

// GrovePiBoard 
 var GrovePiBoard = function() {
	 
   this.state = this.state || STATE_UNINITIALISED;
   
   if(this.state == STATE_UNINITIALISED){
     this.board = this.init.apply(this);
     this.commands = GrovePi.commands;
     this.state = STATE_INITIALISED;
   }
 };

 // Init the GrovePiBoard
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
   
   // Initalize the GrovePiBoard from Dexter
   board.init();
   
   return board;
 };

 // Register Sensor
 GrovePiBoard.prototype.registerSensor = function(sensorType, sensorSubType, pin, repeat, callback){
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
   } else if(sensorType == 'digital'){
     var self = this;
     if(sensorSubType == 'button'){
       var interval = setInterval(function(){
         var value = self.readButtonSensor.apply(self, [pin]);
         callback(value);
       }, repeat * 1000);
     } else if(sensorSubType == 'sound'){
       var interval = setInterval(function(){
         var value = self.readSoundSensor.apply(self, [pin]);
         callback(value);
       }, repeat * 1000);
     } else if(sensorSubType == 'ultrasonic'){
       var interval = setInterval(function(){
         var value = self.readUltrasonicSensor.apply(self, [pin]);
         callback(value);
       }, repeat * 1000);
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
 
 // ReadButtonSensor
 GrovePiBoard.prototype.readButtonSensor = function(pin) {
   var buttonSensor = new GrovePi.sensors.base.Digital(pin);
   var reading = buttonSensor.read();
   return reading;
 };

 // ReadSoundSensor
 GrovePiBoard.prototype.readSoundSensor = function(pin) {
   // Not sure how to do this yet
   var reading = {};
   reading.value = "Unknown";
   return reading;
 };

 // ReadUltrasonicSensor
 GrovePiBoard.prototype.readUltrasonicSensor = function(pin) {
   var ultrasonicSensor = new GrovePi.sensors.UltrasonicDigital(pin);
   var reading = ultrasonicSensor.read();
   return reading;
 };

 // ReadDHTSensor
 GrovePiBoard.prototype.readDHTSensor = function(pin){
   var dhtSensor = new GrovePi.sensors.DHTDigital(pin);
   var reading = dhtSensor.read();
   var formatted = {};
   
   formatted.temperature = reading[0];
   formatted.humdity = reading[1];
   formatted.heatIndex = reading[2];
   
   return formatted;
 };

 // DigitalOutput e.g. LED only write 0/1 or true/false
 GrovePiBoard.prototype.digitalOutput = function(pin, state){
	 if (state == '0' || state == '1' || state == 0 || state == 1 || state == true || state == false) {
		   this.board.writeBytes(this.commands.dWrite.concat([pin, state, this.commands.unused]));	 
	 } else {
	       console.error('DigitalOutput-wrong input');
	 }
 };

 // lcdRGBOutput 
 GrovePiBoard.prototype.lcdRGBOutput = function(pin, rgb, msg){
	 
	 if(typeof msg === 'undefined') {
	     console.error('LcdRGB-Invalid payload: undefined');
	     return;
	 }
	
	 if(typeof rgb !== 'undefined' && rgb.length === 3) {
	     var i2c1 = i2c.openSync(1);
	     setRGB(i2c1, rgb[0], rgb[1], rgb[2]);
	     i2c1.closeSync();
	 } else if(typeof rgb !== 'undefined') {
	     console.error("Invalid rgb:  " + rgb);
	 }
	
	 if(typeof text !== 'undefined') {
	     var i2c1 = i2c.openSync(1);
	     setText(i2c1, payload.text.toString());
	     i2c1.closeSync();
	 }
 };

 // ReadAnalogSensor
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


module.exports = GrovePiBoard;
