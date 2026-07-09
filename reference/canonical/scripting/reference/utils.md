<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/utils/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Utility Classes & Functions

The `indigo.utils` module collects several things that aren't directly tied to a specific
Indigo object but are helpful when writing scripts and building plugins. Everything below is
reached through the `indigo.utils.` prefix from any Indigo Python script or plugin (e.g.
`indigo.utils.ValidationError`).

## Classes { #classes }

| Name | Base | Description |
| --- | --- | --- |
| <span class="nw cb">`IndigoJSONEncoder`</span> | <span class="nw cb">`json.JSONEncoder`</span> | A JSON encoder that converts Python `date`/`datetime` objects (and `NaN`) so they can be serialized. Very useful when encoding a device dictionary into JSON: `json.dumps(dict(my_device), cls=indigo.utils.IndigoJSONEncoder)`. The original name `JSONDateEncoder` is still available as an alias. |
| <span class="nw cb">`ValidationError`</span> | <span class="nw cb">`Exception`</span> | An exception for reporting validation problems. It can carry a single summary message or a whole dictionary of field-specific errors. See [ValidationError](#validationerror) below. |

### IndigoJSONEncoder { #indigojsonencoder }

By default the Python `json` module can't serialize `datetime` objects. Pass this encoder as the
`cls` argument to a JSON dump call and any `date`/`datetime` encountered during encoding is
converted to its ISO string. Indigo constants (e.g. `indigo.kFanMode.Auto`) are encoded as their
full string representation so they can be reconstituted later.

```python
import json
my_device = indigo.devices[123456]
print(json.dumps(dict(my_device), indent=4, cls=indigo.utils.IndigoJSONEncoder))
```

### ValidationError { #validationerror }

`ValidationError` is primarily used when validating fields for commands, messages, or
[Config UIs](../../plugin-dev/reference/xml/configui/validation.md), but it can carry any kind of
validation result. The simplest use is to raise it with a string and let the caller `str()` it.
For more involved cases it holds a dictionary of field names (or keys), each mapped to a single
error string or a list of error strings, so the caller can process individual errors — for
example to mark the offending fields when validating a Config UI.

<span class="ca">**Constructor**</span>

<span class="nw cb">`indigo.utils.ValidationError(message, error_state_str=None, error_dict=None)`</span>

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| <span class="nw cb">`message`</span> | Yes | string | A general message summarizing the entire validation. Useful for logging. |
| <span class="nw cb">`error_state_str`</span> | No | string | If the validation represents a device state issue, this string is used as the device's error state in the various UIs. Pass an empty string to clear any existing error. |
| <span class="nw cb">`error_dict`</span> | No | dict | A dictionary of field names mapped to error message(s) — each value may be a single string or a list of strings. |

<span class="ca">**Attributes**</span>

| Attribute | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`error_message`</span> | string | The general summary message passed to the constructor. |
| <span class="nw cb">`error_state_str`</span> | string or None | The optional device error-state string. |
| <span class="nw cb">`error_dict`</span> | dict | The dictionary of field/key → error message(s). |

<span class="ca">**Methods**</span>

| Method | Description |
| --- | --- |
| <span class="nw cb">`add_error(key, description)`</span> | Add an error for `key` (e.g. a field name). `description` can be a single string or a list of strings. If the key already has an error, the new message is appended (the value becomes a list). |
| <span class="nw cb">`remove_error(key)`</span> | Remove and return all error message(s) for `key`. Note that this removes the entire key, including any multiple messages. |
| <span class="nw cb">`raise_if_errors()`</span> | Raise this exception if there is anything to report — i.e. if `error_dict` is non-empty or `error_state_str` is not `None`. Otherwise does nothing. |

A `ValidationError` is also iterable: calling `dict(my_validation_error)` yields the contents of
`error_dict`. And `str(my_validation_error)` produces a human-readable summary that includes the
general message followed by the formatted error details.

<span class="ca">**Example**</span>

```python
# Accumulate field errors, then raise only if something failed.
errors = indigo.utils.ValidationError("Sensor configuration is invalid")
if not values.get("address"):
    errors.add_error("address", "You must enter an address.")
if not indigo.utils.is_int(values.get("pollInterval", "")):
    errors.add_error("pollInterval", "Poll interval must be a whole number.")

errors.raise_if_errors()   # raises only if at least one error was added
```

For a worked example of turning a `ValidationError` into the error dictionary a Config UI
validation method returns, see
[Validation Methods](../../plugin-dev/reference/xml/configui/validation.md#using-validationerror).

## Functions

### Return Static File { #return-static-file }

Accepts a file path and an optional content type and returns the correctly structured
`indigo.Dict` that the Indigo Web Server (IWS) interprets as a directive to stream the specified
file back to the caller. This avoids returning a large amount of data through the plugin IPC
mechanism.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.utils.return_static_file("some/relative/path/to/file.txt")
indigo.utils.return_static_file("/some/path/to/file.json", status=400, path_is_relative=False, content_type="application/json")
```

<span class="ca">**Parameters**</span>

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| <span class="nw cb">`file_path`</span> | Yes | string or list | A string path to the file, or a list of path parts ending in the file name. |
| <span class="nw cb">`status`</span> | No | int | The HTTP status code to return. Defaults to `200`. |
| <span class="nw cb">`path_is_relative`</span> | No | boolean | `True` if the path is relative to the Indigo install folder, `False` for a complete file path. Defaults to `True`. |
| <span class="nw cb">`content_type`</span> | No | string | The MIME type for the `Content-Type` header. If omitted, an appropriate type is chosen from the file extension. |

The returned `indigo.Dict` can be passed directly back to IWS from an HTTP processing call in your
plugin. It looks something like this:

```json
{
    "status": 404,
    "headers": {
        "Content-Type": "text/html"
    },
    "file_path": "/Library/Application Support/Perceptive Automation/Indigo {{ version }}/Plugins/Example HTTP Responder.indigoPlugin/Contents/Resources/static/html/static_404.html"
}
```

IWS uses this to create the HTTP reply that streams the file back to the caller. The function
raises a `FileNotFoundError` if the file doesn't exist, or a `TypeError` if `file_path` isn't a
list of path parts or a string.

### Validate Email Address { #validate-email-address }

Accepts an email address string and returns `True` if it is constructed correctly, `False`
otherwise. Note: it only checks that the address is *formatted* correctly — it does not verify
that the address exists on the destination system.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.utils.validate_email_address("valid_email@someserver.com")   # True
indigo.utils.validate_email_address("invalid address")             # False
```

<span class="ca">**Parameters**</span>

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| <span class="nw cb">`address`</span> | Yes | string | A string that represents an email address. |

### Boolean Functions { #boolean-functions }

Two functions help convert and use strings that represent boolean values but aren't literally
`True`/`False`. Both use the following map (and its reverse):

```text
BOOL_MAP_TRUE = {
    "y": "n",
    "yes": "no",
    "t": "f",
    "true": "false",
    "on": "off",
    "1": "0",
    "open": "closed",
    "locked": "unlocked",
}
```

`str_to_bool(val)` converts the supplied string to a boolean. It returns `True` for true values
(`y`, `yes`, `t`, `true`, `on`, `1`, `open`, `locked`), `False` for the corresponding false
values, and raises a `ValueError` if the input can't be converted. A `bool` passed in is returned
unchanged.

```python
indigo.utils.str_to_bool("closed")   # False
indigo.utils.str_to_bool("on")       # True
```

`reverse_bool_str_value(val)` returns the string representing the opposite boolean value using the
map above. It raises a `ValueError` if the input can't be found.

```python
indigo.utils.reverse_bool_str_value("closed")   # "open"
```

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| <span class="nw cb">`val`</span> | Yes | string | A string that represents a boolean value as mapped above. |

### Is Integer { #is-int }

Accepts any value and returns `True` if it is an integer or can be cast to one, `False` otherwise.
Handy for validating user-entered Config UI fields, which arrive as strings.

```python
indigo.utils.is_int("42")     # True
indigo.utils.is_int("3.5")    # False
indigo.utils.is_int("abc")    # False
```

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| <span class="nw cb">`value`</span> | Yes | any | Any Python object to test. |

## Converting indigo.Dict and indigo.List { #conversion-methods }

The `indigo.utils` module also attaches convenience methods to the `indigo.Dict` and `indigo.List`
classes that recursively convert them to their native Python counterparts:

```python
python_dict = my_indigo_dict.to_dict()   # recursively convert an indigo.Dict to a python dict
python_list = my_indigo_list.to_list()   # recursively convert an indigo.List to a python list
```

These are the same conversions used when you call `dict()` on an Indigo object. For the full
picture of how a device is represented as a dictionary, see
[Dictionary Representation](devices/dictionary.md).
