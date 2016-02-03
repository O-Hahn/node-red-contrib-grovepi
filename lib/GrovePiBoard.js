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

var GrovePi = require('node-grovepi').GrovePi;

var STATE_UNINITIALISED = 0;
var STATE_INITIALISED   = 1;

 var GrovePiBoard = function() {
   this.state = this.state || STATE_UNINITIALISED;
   if(this.state == STATE_UNINITIALISED){
     this.board = this.init.apply(this);
     this.commands = GrovePi.commands;
     this.state = STATE_INITIALISED;
   }
 };

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
 GrovePiBoard.prototype.readButtonSensor = function(pin) {
   var buttonSensor = new GrovePi.sensors.base.Digital(pin);
   var reading = buttonSensor.read();
   return reading;
 };

 GrovePiBoard.prototype.readSoundSensor = function(pin) {
   // Not sure how to do this yet
   var reading = {};
   reading.value = "Unknown";
   return reading;
 };

 GrovePiBoard.prototype.readUltrasonicSensor = function(pin) {
   var ultrasonicSensor = new GrovePi.sensors.UltrasonicDigital(pin);
   var reading = ultrasonicSensor.read();
   return reading;
 };

 GrovePiBoard.prototype.readDHTSensor = function(pin){
   var dhtSensor = new GrovePi.sensors.DHTDigital(pin);
   var reading = dhtSensor.read();
   var formatted = {};
   formatted.temperature = reading[0];
   formatted.humdity = reading[1];
   formatted.heatIndex = reading[2];
   return formatted;
 };

 GrovePiBoard.prototype.input = function(pin, state){
   this.board.writeBytes(this.commands.dWrite.concat([pin, state, this.commands.unused]));
 };

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
