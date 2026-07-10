<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/configui/serial-port/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Serial Port { .ref-head-no-code #config-serial-port }

PySerial, the Python-based serial communication library that we ship with Indigo, supports not only doing traditional serial communications via physical serial connections, but also by doing serial communications over the network using serial over sockets or RFC 2217 (a standard for serial communication over the network). If the device you're connecting to supports one of these methods of connection then you can use the `serialport` field type. This allows you to specify a single field type that, when rendered in the UI, will expand to multiple fields that will allow the user to select `Local (physical)`, `Network Socket`, or `Network RFC-2217`. Then, based on which option they select, we'll also present the other controls needed to completely select the connection method: a serial port list for the first or the hostname/ip address and port for the last two. Make sure you leave "socket://" or "rfc2217://" as the beginning of the address field for the last two.

![Configuration UI Serial Port Local Image](../../../../images/configui_serialport_local.png)

![Configuration Serial Port Socket Image](../../../../images/configui_serialport_socket.png)

![Configuration Serial Port RFC2217 Image](../../../../images/configui_serialport_rfc2217.png)

`<Field type="serialport" id="devicePortFieldId" />`

This field type generates multiple controls in your dialog automatically. We've also included a helper method, `validateSerialPortUi(valuesDict, errorsDict, u"devicePortFieldId")` that will help you validate that the serialport control was used properly by the user. See the [Validating Serialport Fields](validation.md#validation-serialport-config) section for more information.

[Back to Configuration Dialogs](index.md)
