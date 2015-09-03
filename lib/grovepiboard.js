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

// Global Vars
var initWait  = 1     // in seconds

var isInit    = false
var isHalt    = false
var isBusy    = false
var debugMode = false

var ADDRESS   = 0x04


// Class 
function GrovePiBoard(opts) {
	n.log("GrovePiBoard has been instanciated");
	
  this.BYTESLEN = 4
  this.INPUT = 'input'
  this.OUTPUT = 'output'

  if (typeof opts == 'undefined')
    opts = {}

  if (typeof opts.debug != 'undefined')
    this.debugMode = opts.debug
  else
    this.debugMode = debugMode

  // TODO: Dispatch an error event instead
  if (typeof opts.onError == 'function')
    onError = opts.onError

  // TODO: Dispatch a init event instead
  if (typeof opts.onInit == 'function')
    onInit = opts.onInit
}

GrovePi.prototype.init = function() {
	n.log("Init Function called");
}

GrovePi.prototype.close = function() {
	n.log("Close Function called")
}

//export the class
module.exports = GrovePiBoard


