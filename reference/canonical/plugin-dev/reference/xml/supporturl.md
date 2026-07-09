<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/supporturl/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# SupportURL Elements { .ref-head-no-code #support-url-elements}

Anywhere you can specify a `<SupportURL>` element, the value can be either a full URL or a relative URL. If it's relative, then Indigo will attempt to guess the [best base URL](../../../scripting/reference/server-commands.md#get-web-server-url). You can use this to supply [static HTML](../../guide.md#resources-folder) files or dynamic help provided through the [HTTP processing API discussed below](../plugin-py/http-requests.md#processing-http-requests-in-your-plugin).

**Full URL**
```xml
<SupportURL>
  https://www.somesite.com
</SupportURL>
```

**Relative URL**
```xml
<SupportURL>
  /some/relative/path
</SupportURL>
```
