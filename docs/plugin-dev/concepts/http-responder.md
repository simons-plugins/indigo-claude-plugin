# HTTP Responder

**Official Documentation**: https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide#http_request_processing

Plugins can serve web content through Indigo's built-in web server (IWS). Define HTTP handler actions in `Actions.xml` and implement handler methods in `plugin.py`.

## URL Pattern

```
http://localhost:8176/message/{CFBundleIdentifier}/{action_id}/{path...}?{query_args}
```

Example: `http://localhost:8176/message/com.my.plugin/api/devices/123.json`

## Actions.xml Setup

Define an HTTP action (typically hidden from the action UI):

```xml
<Actions>
    <Action id="api">
        <Name>API Endpoint</Name>
        <CallbackMethod>api</CallbackMethod>
    </Action>
</Actions>
```

## Handler Method

```python
def api(self, action, dev=None, caller_waiting_for_result=None):
    props_dict = dict(action.props)

    # Request data
    file_path = props_dict.get("file_path", [])         # URL path segments (list)
    query_args = props_dict.get("url_query_args", {})    # Query parameters (dict)
    method = props_dict.get("incoming_request_method", "GET")  # HTTP method
    body_params = props_dict.get("body_params", {})      # POST body parameters (dict)

    # Build response
    reply = indigo.Dict()
    reply["status"] = 200
    reply["content"] = json.dumps({"message": "Hello"})
    reply["headers"] = indigo.Dict()
    reply["headers"]["Content-Type"] = "application/json"
    return reply
```

### Request Properties (from action.props)

| Key | Type | Description |
|-----|------|-------------|
| `file_path` | list | URL path segments after the action ID |
| `url_query_args` | dict | Query string parameters |
| `incoming_request_method` | str | HTTP method (`"GET"`, `"POST"`, etc.) |
| `body_params` | dict | POST/PUT body parameters |

### Reply Object

| Key | Type | Description |
|-----|------|-------------|
| `status` | int | HTTP status code (200, 400, 404, 500) |
| `content` | str | Response body |
| `headers` | indigo.Dict | Response headers (must include `Content-Type`) |

## Content Types

```python
# JSON
reply["headers"]["Content-Type"] = "application/json"
reply["content"] = json.dumps(data)

# HTML
reply["headers"]["Content-Type"] = "text/html"
reply["content"] = "<html><body>Hello</body></html>"

# XML
reply["headers"]["Content-Type"] = "application/xml"
reply["content"] = "<response><status>ok</status></response>"
```

## Jinja2 Templates

Use Jinja2 for HTML templating. Templates live in `Contents/Resources/templates/`:

```python
import jinja2

def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.templates = jinja2.Environment(
        loader=jinja2.FileSystemLoader("../Resources/templates")
    )

def config(self, action, dev=None, caller_waiting_for_result=None):
    template = self.templates.get_template("config.html")
    context = {"plugin": self, "devices": indigo.devices}

    reply = indigo.Dict()
    reply["status"] = 200
    reply["content"] = template.render(context)
    reply["headers"] = indigo.Dict()
    reply["headers"]["Content-Type"] = "text/html"
    return reply
```

## Static File Serving

### Auto-Served Content

Files in `Contents/Resources/` are automatically served by IWS:

```
Contents/Resources/
├── static/
│   ├── css/style.css
│   ├── html/help.html
│   └── js/app.js
└── templates/
    └── config.html
```

Access via: `http://localhost:8176/{CFBundleIdentifier}/static/css/style.css`

### return_static_file() Utility

Serve files programmatically from a handler:

```python
reply = indigo.utils.return_static_file(
    f"{self.pluginFolderPath}/Contents/Resources/static/html/help.html",
    status=200,
    path_is_relative=False
)
return reply
```

Parameters:
- **file_path** — Path to the file
- **status** — HTTP status code (default 200)
- **path_is_relative** — `True` for relative paths, `False` for absolute
- **content_type** — Override content type (auto-detected if omitted)

## Error Handling

```python
def api(self, action, dev=None, caller_waiting_for_result=None):
    props_dict = dict(action.props)
    file_path = props_dict.get("file_path", [])

    reply = indigo.Dict()
    reply["headers"] = indigo.Dict()

    # 404 - Not Found
    if not file_path:
        reply["status"] = 404
        reply["content"] = json.dumps({"error": "Not found"})
        reply["headers"]["Content-Type"] = "application/json"
        return reply

    # 400 - Bad Request
    query_args = props_dict.get("url_query_args", {})
    if "required_param" not in query_args:
        reply["status"] = 400
        reply["content"] = json.dumps({"error": "Missing required parameter"})
        reply["headers"]["Content-Type"] = "application/json"
        return reply

    # 500 - Internal Server Error
    try:
        result = self._process_request(file_path)
        reply["status"] = 200
        reply["content"] = json.dumps(result)
        reply["headers"]["Content-Type"] = "application/json"
    except Exception as exc:
        self.logger.exception("Request processing error")
        reply["status"] = 500
        reply["content"] = json.dumps({"error": str(exc)})
        reply["headers"]["Content-Type"] = "application/json"

    return reply
```

## See Also

- [SDK Examples Guide](../examples/sdk-examples-guide.md) — Example HTTP Responder
- [Utility Functions](../api/iom/utilities.md) — `return_static_file()`
