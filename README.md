# node-red-contrib-grovepi
=================================

A <a href="http://nodered.org" target="_new">Node-RED</a> node to listen to and control GrovePi+ sensors and actuators from the StarterKit.
This node will only work on an Raspberry Pi with a GrovePi daughter card and GrovePi Sensors - best if you have the GrovePi+ Starterkit. 

Install
-------

Run the following command in the root directory of your Node-RED install or home directory (usually ~/.node-red) and will also install needed libraries.

        npm install node-red-node-grovepi


Usage
-----

Provides a few node, some to read data from sensors and a few to send data to actuators.


### GrovePi Configuration

To implement all nodes with only one configuration setting - there is a config node implemented for the GrovePi Board. It contains internal values - and has only a name. 

### GrovePi Analog Sensor Node

Reads data from GrovePi Analog sensors. This node simply sends a numerical value between 0 and 1024 (check this). The Value of the sensor will be in msg.payload.

### GrovePi Digital Sensor Node

Reads data from GrovePi Digital sensors. This node requires that the user selects the type of digital sensor attached.
Choices currently include:
 * Button (1/0)
 * Sound
 * Ultrasonic Range
 * Temperature / Humidity

Depending on the sensor type selected, the payload will differ. For instance, Sound and Ultrasonic will have a value, the button type will return a JSON object containing a 'state' key.

``` { state: true } ```

The Temperature / Humidity sensor will return values in separate keys

```
{
    temperature: 22.5,
    humidity: 39,
    heatIndex
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

The msg.payload should have separate keys. If rgb is not set, the information will be the once configured with the node itself.

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
*   Temperature Humidity
*   Sound Sensor
*   Rotary Angle
*   RGB Backlight LCD
*   Light


Open Tasks
----------
*	Button as Event-Sensor not time sliced (every 1 sec..) like the digital sensor node
*   Show the correct status on the node
*	Additional GrovePi Sensores and Actuators (e.g. OLED, ..)