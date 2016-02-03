# node-red-contrib-grovepi
================================
A <a href="http://nodered.org" target="_new">Node-RED</a> node to listen to and control GrovePi sensors and actuators.

Install
-------

Run the following command in the root directory of your Node-RED install or home directory (usually ~/.node-red)

        npm install node-red-node-grovepi


Usage
-----

Provides a few node, some to read data from sensors and a few to send data to actuators.


### Analog Input Node

Reads data from GrovePi Analog sensors. This node simply sends a numerical value between 0 and 1024 (check this).

### Digital Input Node

Reads data from GrovePi Digital sensors. This node requires that the user selects the type of digital sensor attached.
Choices currently include:
 * Button (1/0)
 * Sound
 * Ultrasonic Range
 * Temperature / Humidity

Depending on the sensor type selected, the payload will differ. For instance, the button type will return a JSON object containing a 'state' key e.g.

```
{ state: true }
```

The Temperature / Humidity sensor will return both values in separate keys

```
{
    temperature: 22.5,
    Humidity: 39
}
```

### Output Node

Sends data to GrovePi Actuators e.g. LEDs, Buzzers.
Since Output nodes can either be high or low, the payload sent to the node should reflect this. The following are acceptable:

```1 or 0, true or false ```

Any other value will be treated as 1 / true and the output will be put high.




Node-RED nodes to control GrovePi+ Starter Kit sensors for Raspberry Pi
------------------------------------------------------------------------

Every sensor that comes with the GrovePi+ Starter Kit is supported. These sensors are:
*   Buzzer
*   Button
*   LED (red, green & blue)
*   Sound
*   Relay
*   Ultrasonic Ranger
*   Temperature Humidity
*   Rotary Angle
*   RGB Backlit LCD
*   Light
