<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/automation/get-contents-of-url/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Get Contents of URL Action

!!! abstract "In this guide"
    How to use the Get Contents of URL action to fetch data from HTTP endpoints and store the response in an Indigo variable. Covers the supported HTTP methods, authentication options, custom headers, the request body field with substitution support, and worked examples for common REST APIs.

The Get Contents of URL Action allows users to query APIs and other URLs and save the results of the query to an Indigo variable for display or for further processing.

![Get Contents of URL Action Image](../../images/get_contents_of_url_action.png)

- `Enter the URL` - use this field to enter the URL of the target resource.
- `Method` - use this option to... The action supports all the major resource I/O methods including: `*GET*`, `*POST*`, `*PUT*`, `*PATCH*` and `*DELETE*`.
- `HTTP Auth` - if the target resource requires authentication (as most do), use this option to enter the necessary authentication details.
    - `Auth Type` - use this option to select the authentication method used by the target resource. The control supports both `*BASIC*` and `*DIGEST*` auth types.
    - `Username` - use this field to enter the username of the target resource.
    - `Password` - use this field to enter the password of the target resource.
- `Show Headers` - There are two major sections to the Show Headers control: the first set of controls is used to edit or delete an existing header key/value pair, and the second set is for adding a new header. The checkbox is only used to show/hide the controls; any added headers are used even if the checkbox is unchecked.
    - `Header` - use this option to select from a list of headers for the action. The list will be empty if no headers have been added. Use the add header controls to add a new header.
    - `Key` - use this option to create your header key. You can create multiple keys, but only one at a time.
    - `Value` - use this option to create your header value. You can create multiple values, but only one at a time.
- `Body` - use this field to enter the body message (including Indigo substitutions). Anything in this field will be inserted into the body of the HTTP message. We use it exactly as it comes from the field with no post-processing other than the normal device and variable substitutions.
- `Store Result in Variable` - use this option to store the results of the URL call to an Indigo variable. If enabled, you can select from a list of available variables. Note that Indigo stores all variable values as strings (text), so any value saved to a variable using the Get Contents from URL action will be coerced into a string.

## Examples
Here are a couple of examples to get you started.

### Example 1
*`Enter the URL`* -> https://api.weather.gov/stations/KATT/observations/latest

*`Method`* -> Get

*`HTTP Auth`* -> False

*`Show Headers`* -> False

*`Body`* -> None

*`Store result in variable`* -> True

*`Variable`* -> [choose the appropriate variable]

### Example 2
*`Enter the URL`* -> https://httpbin.org/bearer

*`Method`* -> Get

*`HTTP Auth`* -> False

*`Show Headers`* -> True

Add a Header (be sure to click the *`Add Header`* button:

*`Key`* -> Authorization

*`Value`* -> Bearer indigo123

*`Body`* -> None

*`Store result in variable`* -> True

*`Variable`* -> [choose the appropriate variable]
