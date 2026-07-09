<!-- GENERATED from https://docs.indigodomo.com/2025.2/api/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Integration APIs
This article is about the two APIs in IWS that developers can use to integrate Indigo with external services:

- [WebSocket API](websocket.md) – (which the new Indigo Touch Web UI uses), and
- [HTTP API](http.md) – shares as much of the messaging construction with the WebSocket interface as is practical.

Both of these APIs are authenticated with HTTP Digest, API Keys, and [local secrets](../user/remote-access/web-server.md#authentication) (either as a query string or preferably an Authorization header) depending on how the user configures it in the Start Local Server dialog.

!!! warning "Warning"
    - **HTTP Basic authentication** has been deprecated due to its insecure nature.
    - The old REST API has been deprecated in favor of the [HTTP API](http.md).

## Versioning
A quick note on versioning: all APIs will be versioned under the following scheme:

- `/v2/` - this is the top level version number and will change as necessary

### Python vs JavaScript
In these APIs, we’re using [JSON](https://www.json.org/) (JavaScript Object Notation) as the message format for communicating between the WebSocket and HTTP APIs and IWS. In JavaScript, an “object” definition looks (almost) exactly like a Python dictionary (and vice versa). So we may refer to an object or dictionary (dict): for the purposes of this document, they refer to the same JSON construct. For example, we may call this an object or a dict:

```json
{
  "key1": "value 1",
  "key2": 2
}
```

We expect there will be both Python and JavaScript users integrating our APIs, so we wanted to explicitly call this out. As a primarily Python organization, you may notice a bias towards “dict”.

Python developers will notice the use of `null` in the message descriptions. This corresponds to the Python `None` object. Also of note are the booleans `true` and `false`, which are capitalized in Python but not in JSON. Here’s a handy cheat sheet:

| Python | JSON Equivalent |
|--------|-----------------|
| True   | true            |
| False  | false           |
| float  | Number          |
| int    | Number          |
| None   | null            |
| dict   | Object          |
| list   | Array           |
| tuple  | Array           |
| str    | String          |


If you are new to JSON, you may want to use the [JSON Validator website](https://jsonlint.com) to validate that the JSON message you are sending is valid JSON.
