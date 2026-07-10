<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/remote-access/ssl-certificates/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Indigo Web Server Certificates

!!! abstract "In this guide"
    How to configure browsers and HTTP clients (such as Node-RED) to accept the Indigo Web Server's self-signed SSL certificate for local HTTPS connections. Covers locating the certificate files in the Web Assets folder and configuring TLS settings in third-party tools.

## Node Red Example
The following example shows how to configure a Node Red flow that uses the Indigo Web Server (IWS) API to operate a lamp device. The example is only meant to show how to use a self-signed certificate and public key to enable the flow to connect to the IWS using `*https*` instead of `*http*` when using the IWS on a local network via `*10.0.1.123*`, `*127.0.0.1*`, or `*localhost*` (using the API via the Indigo Reflector Service uses a different CA-approved security certificate and the flow is configured the same as it would be using any API via `*https*`).

![Noe Red Image](../../images/node_red_1_flow.png){ width=600 }

Using the flow via `*https*` requires a few settings. Enter the preferred URL to point at the local IWS address `*10.0.1.123*`, `*127.0.0.1*`, or `*localhost*` with the URL:

```text
https://<INDIGO IP ADDRESS>:8176/v2/api/command/
```
for example,
```text
https://10.0.1.123:8176/v2/api/command/
```

![Node Red 6 HTTP Request Node Image](../../images/node_red_6_http_request_node.png){ width=400 }

select TLS, and use bearer authentication along with a valid token key (from your Indigo Account Authorizations).

Then, use key and certificates from local files and point them to the certificate and public key files located in

```text
/Library/Application Support/Perceptive Automation/Indigo {{ version }}/Web Assets/cert/
```

![Node Red 7 HTTP Request Node Image](../../images/node_red_7_http_request_node_tls_config.png){ width=400 }

Several other screenshots complete the example:
| ![Node Red Inject Node Turn On Image](../../images/node_red_2_inject_node_turn_on.png){ width=400 } |
| --- | --- |
| ![Node Red Inject Node Turn On JSON Image](../../images/node_red_3_inject_node_turn_on_json.png){ width=400 } |
| ![Node Red Inject Node Turn Off Image](../../images/node_red_4_inject_node_turn_off.png){ width=400 } |
| ![Node Red Inject Node Turn Off JSON Image](../../images/node_red_5_inject_node_turn_off_json.png){ width=400 } |
| ![Node Red HTTP Debug Node Image](../../images/node_red_8_http_debug_node.png){ width=400 } |
