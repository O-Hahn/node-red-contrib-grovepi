# node-red-contrib-grovepi 

A <a href="http://nodered.org" target="_new">Node-RED</a> node to listen to and control GrovePi+ sensors and actuators from the StarterKit.
This node will only work on an Raspberry Pi with a GrovePi daughter card and GrovePi Sensors - best if you have the GrovePi+ Starterkit. 

Install
-------

Run the following command in the root directory of your Node-RED install or home directory (usually ~/.node-red) and will also install needed libraries.

     
	npm install node-red-contrib-grovepi


If you install it on Raspberry Pi run npm update before:

	npm -g install npm

This node was tested under Nodejs V8.11 LTS, NPM 5.6 and Node-Red 0.18

Usage
-----

This package provides a few nodes to read data from sensors (analog and digital, some actuators and the RGB LCD Display.
With this package you can build very easy prototypes for the Internet of Things environment with the Raspberry Pi. 
It is used to do some education stuff with the <a href="https://www.ibm.com/cloud/internet-of-things" target="_new">IBM Watson IoT Platform on IBM Cloud</a> but also could be used with others.


### GrovePi Configuration

To implement all nodes with only one configuration setting - there is a config node implemented for the GrovePi Board. It contains internal values - and has only a name. 

### GrovePi Analog Sensor Node

Reads data from GrovePi Analog sensors. This node simply sends a numerical value between 0 and 1024 (check this). The Value of the sensor will be in <b>msg.payload</b>.

### GrovePi Digital Sensor Node

Reads data from GrovePi Digital sensors. This node requires that the user selects the type of digital sensor attached.
Choices currently include:
 * Button (true/false)
 * Sound
 * Ultrasonic Range
 * Temperature / Humidity

Depending on the sensor type selected, the payload will differ. For instance, Sound and Ultrasonic and Button will have a value, the Temperature / Humidity Sensor will return a JSON object.

The Temperature / Humidity sensor will return values in separate keys

```
{
    temperature: 23.5,
    humidity: 36,
    heatIndex: 28.08
}
```

### GrovePi Digital Event Sensor Node

Reads data from GrovePi Digital sensor event based. It is for example for the button sensor. The button is press will throw an event.  

### GrovePi Digital Output Node

Sends data to GrovePi Actuators e.g. LEDs, Buzzers.
Since Output nodes can either be high or low, the payload sent to the node should reflect this. The following are acceptable:

```1 or 0, true or false ```

Any other value will be treated as 1 / true and the output will be put high.

### GrovePi LcdRGB Output Node

Sends data to GrovePi LcdRGB I2C-Device. 

The <b>msg.payload</b> should have separate keys. If rgb is not set, the information will be the once configured with the node itself.

```
    text: <the lcd text>,
    rgb: [255,0,0]
```


Node-RED nodes to control GrovePi+ Starter Kit sensors for Raspberry Pi
------------------------------------------------------------------------

Every sensor that comes with the GrovePi+ Starter Kit is supported. 
These sensors/actuators are:
*   Buzzer
*   Button
*   LED (red, green & blue)
*   Relay
*   Ultrasonic Ranger
*   Temperature Humidity (DHT11 and DTH22)
*   Sound Sensor
*   Rotary Angle
*   RGB Backlight LCD
*   Light


Open Tasks
----------
*	Button as Event-Sensor not time sliced (every 1 sec..) like the digital sensor node
*	Additional GrovePi Sensor and Actuator (e.g. OLED, ..)