<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/device-subclasses/multiio/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# MultiIODevice { .ref-head-no-code }

I/O devices have a wide variety of capabilities that we’ve tried to boil down to some specifics. The I/O devices that Indigo supports generally have some combination of three types of inputs: analog, binary, and sensor. They may also support some number of binary outputs.

## Class Properties { .ref-head-no-code }

All outputs are modified using commands below.

| Property                                       | Type            | Writable | Description                                                                                                                            |
|------------------------------------------------|-----------------|----------|----------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`analogInputs`</span>      | list of integer | No       | a list of the current analog input values, one per input, in a python list - can be accessed individually using the states below       |
| <span class="nw cb">`analogInputCount`</span>  | integer         | No       | number of analog inputs this device supports                                                                                           |
| <span class="nw cb">`binaryInputs`</span>      | list of boolean | No       | a list of the current binary input values, one per input - can be accessed individually using the states below                         |
| <span class="nw cb">`binaryInputCount`</span>  | integer         | No       | number of binary inputs this device supports                                                                                           |
| <span class="nw cb">`binaryOutputs`</span>     | list of boolean | No       | a list of the current binary output values, on per output (max 12 total outputs) - can be accessed individually using the states below |
| <span class="nw cb">`binaryOutputCount`</span> | integer         | No       | number of binary outputs this device supports                                                                                          |
| <span class="nw cb">`sensorInputCount`</span>  | integer         | No       | number of sensor inputs this device supports                                                                                           |
| <span class="nw cb">`sensorInputs`</span>      | list of integer | No       | a list of the current sensor input values, one per input - can be accessed individually using the states below                         |

## Device States { .ref-head-no-code }

These are the states provided by this device type and accessible through the `dev.states` dictionary. They are read-only.

| State ID                                      | Type    | Property Name | Notes                                                                                                                                               |
|-----------------------------------------------|---------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`analogInput#`</span>     | integer | N/A           | value of input number represented by the # sign (input 1 would be `analogInput1`) - there will only be `dev.analogInputCount` inputs available      |
| <span class="nw cb">`analogInputsAll`</span>  | string  | N/A           | a comma separated list of all analog input values. Can be accessed as a Python list of integers by using `dev.analogInputs`.                        |
| <span class="nw cb">`binaryInput#`</span>     | boolean | N/A           | value of input number represented by the # sign (input 1 would be `binaryInput1`) - there will only be `dev.binaryInputCount` inputs available      |
| <span class="nw cb">`binaryInputsAll`</span>  | string  | N/A           | a comma separated list of all binary input values. Can be accessed as a Python list of booleans by using `dev.binaryInputs`.                        |
| <span class="nw cb">`binaryOutput#`</span>    | boolean | N/A           | value of output number represented by the # sign (output 1 would be `binaryOutput1`) - there will only be `dev.binaryOutputCount` outputs available |
| <span class="nw cb">`binaryOutputsAll`</span> | string  | N/A           | a comma separated list of all binary output values. Can be accessed as a Python list of booleans by using `dev.binaryOutputs`.                      |
| <span class="nw cb">`sensorInput#`</span>     | integer | N/A           | value of input number represented by the # sign (input 1 would be `sensorInput1`) - there will only be `dev.sensorInputCount` inputs available      |
| <span class="nw cb">`sensorInputsAll`</span>  | string  | N/A           | a comma separated list of all binary input values. Can be accessed as a Python list of booleans by using `dev.sensorInputs`.                        |

## Commands (indigo.iodevice.*) { .ref-head-no-code }

### Set Binary Output { .ref-head-no-code }

Set the state of the specified binary output.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.iodevice.setBinaryOutput(123, index=2, value=True)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                                |
|------------------------------------------|----------|---------|------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                               |
| <span class="nw cb">`index`</span>       | Yes      | integer | 0-based index of the output to change - should be less than the `binaryOutputCount` property of the device |
| <span class="nw cb">`value`</span>       | Yes      | boolean | True to turn the output on, False to turn it off                                                           |

<span class="ca">**Examples**</span>

```python

# If binary input 3 is true, set binary output 1

# to false (python arrays are 0-based)

myIODevice = indigo.devices[123]
if not myIODevice.binaryInputs[2]:
	indigo.iodevice.setBinaryOutput(myIODevice, index=1, value=False)
```
