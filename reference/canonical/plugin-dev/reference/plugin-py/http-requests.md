<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/http-requests/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Processing HTTP requests in your plugin

Your plugin can process arbitrary HTTP GET or POST requests that are sent to a specific Indigo Web Server (IWS) URL:

`https://myreflector.indigodomo.net/message/PLUGINID/actionId/`

Substitute the ID of your plugin (as specified in its Info.plist) and the ID of the action that will handle the request (as specified in the Actions.xml). You can also use the direct IP address instead of your reflector.

The HTTP request must authenticate if the IWS server has authentication enabled:

- The recommended approach is to use an API key: the request must contain an "Authorization" HTTP header, the value of which is "Bearer API_KEY_HERE", where you substitute an API key that is generated from the [Authorizations page](https://www.indigodomo.com/account/authorizations) in the user's Indigo Account. This is also how OAuth is used to authenticate when using an external service like Alexa or Google Home.
- If for some reason you can't include the header, you may pass the API key as an additional GET argument on the URL (`?other=args&api-key=KEYHERE`)

## Request
As a reminder, here's how you specify an action in Actions.xml that is used only via an API (from another plugin such as the IWS plugin):

<span class="ca">**Command Syntax Examples**</span> 

```xml
<Action id="handle_message" uiPath="hidden">
    <Name>some message</Name>
    <CallbackMethod>handle_some_action</CallbackMethod>
</Action>
```

And here's how an action method is defined in your plugin:

```python
def handle_some_action(self, action, dev=None, callerWaitingForResult=None):
    some_value = action.props["somekey"]
    return some_value
```

Given these examples, here's the URL that would get directed to that action:

`https://myreflector.indigodomo.net/message/com.your.pluginId/handle_message/`

Calls via this method will always pass in `callerWaitingForResult=True`. You will want to make sure that your plugin returns as quickly as possible - any long-running processes should be put into another thread with some sort of asynchronous message back to the caller if necessary.

IWS will insert several things into the `action.props` dictionary:

| **Key**                                              | **Value**                                                                                                                                                                                                                                           |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`incoming_request_method`</span> | this will be either **POST** or **GET**.                                                                                                                                                                                                            |
| <span class="nw cb">`headers`</span>                 | this is a dictionary of the headers in the request.                                                                                                                                                                                                 |
| <span class="nw cb">`body_params`</span>             | if this key exists, it will be a dictionary containing any form **POST** name/value pairs. It won't exist if the request was a **GET** or a **POST** *with a body*.                                                                                 |
| <span class="nw cb">`url_query_args`</span>          | if there were any query args on the URL line, they will be in this dictionary if it exists.                                                                                                                                                         |
| <span class="nw cb">`request_body`</span>            | this will be the contents of the body of the HTTP request. It won't exist if the request was a **GET** or a **POST** *without any body*.                                                                                                            |
| <span class="nw cb">`file_path`</span>               | this will be a list of path parts from the URL after the action ID. So for the url: `http://host/message/pluginid/actionid/path/to/some/file.txt` the value will be an `indigo.List` with the following items: `["path", "to", "some", "file.txt"]` |

!!! note
    The dicts mentioned above will all be *indigo.Dict* objects, not standard Python dicts.

### Validating the request payload

When you handle a JSON (or form) message, you'll typically want to validate the incoming fields
before acting on them. The [`indigo.utils.ValidationError`](../../../scripting/reference/utils.md#validationerror)
exception is handy here: accumulate per-field errors, raise once, and return a readable error
message with an appropriate HTTP status. The same validation helper can be shared with your
[Config UI validation methods](../xml/configui/validation.md#using-validationerror).

```python
import json

def handle_some_action(self, action, dev=None, callerWaitingForResult=None):
    try:
        payload = json.loads(action.props.get("request_body", "{}"))
        errors = indigo.utils.ValidationError("Invalid request payload")
        if "name" not in payload:
            errors.add_error("name", "the 'name' field is required")
        if "value" in payload and not indigo.utils.is_int(payload["value"]):
            errors.add_error("value", "'value' must be a number")
        errors.raise_if_errors()   # raises only if an error was added
    except (ValueError, indigo.utils.ValidationError) as exc:
        # ValueError covers malformed JSON from json.loads()
        return {"status": 400, "content": str(exc)}

    # ...payload is valid, do the work and return a reply...
    return json.dumps({"result": "ok"})
```

## Reply
What your plugin should return in the simplest case is a JSON string which will just be passed back in the HTTP reply. Your plugin can also return a more complex dictionary containing the following keys:

| **Key**                              | **Value**                                                                                                                                                                             |
|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`status`</span>  | this is an integer representing a valid [HTTP return code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). If it's not included, a 200 will be returned.                    |
| <span class="nw cb">`headers`</span> | a dictionary of HTTP headers that will be added to the reply. Most useful will be the 'Content-Type' header if you want to return something else besides JSON (which is the default). |
| <span class="nw cb">`content`</span> | this is the actual string returned in the HTTP reply. Defaults to an empty string.                                                                                                    |


This will allow you to return just about anything - HTML, XML, plain text, etc. IWS will do **no postprocessing** of the content string, so you must ensure that you are returning the properly formatted information that the requester is expecting.

You can also pass back an `indigo.Dict` instance that will instruct IWS to stream a file from the filesystem back to the requester. This is the structure:

<span class="ca">**Command Syntax Examples**</span> 

```text
{
    "status": 310,   # Internal status code indicating that IWS should stream back the specified file.
    "file_path": path, # this is a full path string
    "headers": indigo.Dict({"Content-Type": content_type} # you should add a Content-Type header
)
```

We've provided [a utility method](../../../scripting/reference/utils.md#return-static-file) that will validate that the file specified exists and then will pass back the appropriate `indigo.Dict` instance.

## Errors
IWS will return the following HTTP error responses if an error occurs trying to process a request:

| **Status**                       | **Meaning**                                                                      |
|----------------------------------|----------------------------------------------------------------------------------|
| <span class="nw cb">`401`</span> | if the OAuth token is invalid.                                                   |
| <span class="nw cb">`405`</span> | if any method other than **POST** or **GET** is attempted.                       |
| <span class="nw cb">`500`</span> | any unexpected/uncaught exception.                                               |
| <span class="nw cb">`501`</span> | if the plugin isn't installed or doesn't define the action specified in the URL. |
| <span class="nw cb">`503`</span> | if the plugin is installed but is disabled.                                      |

For `50x` errors, a JSON dictionary will be returned describing the issue:

| **Key**                                  | **Value**                                                                                                |
|------------------------------------------|----------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`error`</span>       | One of: `plugin_disabled`, `invalid_plugin`, `invalid_action`, `unknown_error`                           |
| <span class="nw cb">`description`</span> | A textual description of the error                                                                       |
| <span class="nw cb">`exception`</span>   | Only returned when an `unknown_error` is returned. It will be the stack trace of the uncaught exception. |

If your handler returns any kind of error (4xx or 5xx) and includes a message, that message will be returned to the caller as the body of the HTTP reply. This will allow you to return a custom page (404 for instance) that will more appropriately reflect the error.

### Usage Guidance
This API is meant primarily for small(ish) text message handling, like JSON/XML messaging APIs or small HTML files. There are a few things that you will want to avoid:

- Long-running actions - if your action should be relatively quick to respond: 15-20 seconds is the max guidance
- Large files - large files will slow the total turnaround time, which you need to minimize (see above)
- Binary data - the API isn't designed for binary data

For long-running actions, one pattern would be to reply immediately with some kind of acknowledgement of the incoming message, then handle the processing asynchronously. As this approach would complete the HTTP request/response loop, if your caller needs some kind of status after processing you would need to handle that yourself.
