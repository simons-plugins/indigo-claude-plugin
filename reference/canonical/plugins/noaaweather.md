<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/noaaweather/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# NOAA Weather
This is the official weather plugin for Indigo. You may create as many "Weather Station" devices as you like. Each station will have a variety of device states that hold information that can be used in triggers, conditions, and on control pages. **<span class="dw-color-red">NOTE</span>**: some information may not be available for any given station - if the data isn't available in the NOAA data feed, the value of that particular state will be "- data unavailable -".

[NOAA stations](http://www.weather.gov/xml/current_obs/) are primarily Airports in the US, and those tend to have the most data. There are other [NOAA stations](http://www.weather.gov/xml/current_obs/) as well but the data from them tends to be spotty at best. There is also [a map](https://madis-data.ncep.noaa.gov/MadisSurface/) you can use to locate other weather station locations. Why do we use NOAA data, which is **only available in the US**, rather than some other provider (like WeatherUnderground or WeatherBug)? Put simply, they either have severe restrictions on what commercial users can do with the data, or they require licensing fees. Neither of which we're currently prepared to deal with. NOAA data is completely free and unencumbered. You may have heard that Google has a weather API - which is sorta true. It's not a published API, and we're not big fans of using unpublished APIs (they tend to break with no warning).

So, for now, NOAA is the best solution for our official weather plugin. The data quality is very good and is likely good enough for many of your purposes. You can also search the User Contribution Library for other [weather solutions.](http://www.indigodomo.com/library/index.php?keywords=weather)

## Plugin Config
The plugin's config dialog has a setting to allow you to configure the display of temperature information in the Indigo UI to one of four settings:

- Degrees F
- Degrees C
- Degrees F (Degrees C)
- Degrees C (Degrees F)

The second setting in the dialog allows you to turn on extra debugging information in the Event Log. Unless you're trying to debug a problem it's probably best to leave that unchecked.

### Creating a Weather Station Device
The NOAA Weather Plugin allows you to create Weather Station devices. To create a new one, switch to the device view and click the `New...` button. This will bring up the device edit dialog. Select `Plugin` from the `Type:` popup. Select `NOAA Weather` from the `Plugin:` popup, and select `Weather Station` from the `Model:` popup. Click on the `Edit Device Settings...` button, and you'll see the Weather Station Config UI. Enter the NOAA station id in the text box at the top. You can click on the "Find NOAA Stations" to have a browser window open to the NOAA webpage where you can start your search.

Once you've found the station ID and entered it in the text field, click "Save". If we can successfully contact NOAA and get the station data, we'll close the dialog. If not we'll show you an error indicating that we couldn't get the station's data file. You should try another station if this happens or confirm that you entered the station id correctly. From time to time, the NOAA system may not be responding to API calls and, if you've entered the station ID correctly, you may need to wait and try again later.

### Creating Weather Forecast, Current Conditions, and Weather Alerts Devices
There are three additional weather device types that can provide additional weather data -- Alerts, Conditions, and Forecast data.  These devices are based on more precise location information -- your lat/long coordinates (or any valid coordinates you provide) -- rather than being linked to a weather station (which may not be nearby). The creation and configuration of these devices is very straightforward.

The current conditions device is meant to mimic the original weather station device as closely as possible. Linking your logic to these new device types should work, but if you decide to transition to these new device types, you should confirm they are working the way you expect.

### Weather Station and Current Conditions Device States
You can trigger off of various state changes on a Weather Station (or Current Conditions Device) - like when the temperature or wind direction change. Some of these states don't make for good triggers but will provide some nice information on a control page.

![NOAA Trigger States Image](../images/noaatriggerstates.png)

Weather Station device types provide you with several device states that you can use in the Trigger dialog:

- `Current Condition` - The current condition in a word or two
- `Current Condition Icon` - The current condition icon - Indigo ships with "NOAA Condition+.png" and it's children, one for each condition that's returned in this field. So, in the control page editor, select this state and "NOAA Condition+.png" and you'll have a nice conditions icon (images provided by NOAA).
- `Dew Point °C` - Dew point in Celsius
- `Dew Point °F` - Dew point in Fahrenheit
- `Dew Point String` - Dew point in a human-readable string
- `Heat Index °C` - Heat index in Celsius
- `Heat Index °F` - Heat index in Fahrenheit
- `Heat Index String` - Heat index in a human-readable string
- `Humidity` - The relative humidity
- `Latitude` - Latitude
- `Location` - Location in human-readable form
- `Longitude` - Longitude
- `Observation Date/Time` - The last time NOAA updated the data. This field is in `YYYY-MM-DD HH:MM:SS` so it can be parsed by other software if needed.
- `Pressure (inches)` - Pressure in inches
- `Pressure (mbar)` - Pressure in millibars
- `Quality Codes` - For scripters to account for the relative quality of the various weather observations (JSON).  [See below for what the codes mean.](#quality-codes)
- `Temperature °C` - Temperature in Celsius
- `Temperature °F` - Temperature in Fahrenheit
- `Temperature String` - Temperature in a human-readable string (i.e. "98.0 F (36.7 C)") - this is the state shown in the "State" column for a Weather Station device
- `Time Zone` - The timezone as it applies to the observed location.
- `Visibility` - Visibility in miles
- `Wind Degrees` - Wind direction in degrees
- `Wind Direction` - Wind direction description in something close to human-readable form
- `Wind Knots` - Wind speed in knots
- `Wind MPH` - Wind speed in miles per hour
- `Wind String` - A description of the wind in human-readable form

### Weather Alert Device States
With Weather Alert Devices, the device's states will be blank unless there are active alerts.  If there are active alerts, information on up to five alerts will be available.  <span class="dw-color-red">This information is provided for informational purposes only and should not be relied upon for the purposes of personal safety.</span>

### Weather Forecast Device States
There are several device states available with the Weather Forecast Device, each having an index value keyed to individual days. Up to 14 days' worth of information may be available.


## Quality Codes
The NOAA Weather plugin includes a `qualityCodes` state. This state includes information (from NOAA) on the perceived quality of select data elements.  An example `qualityCodes` state value is:

    {"temperature": "V", "dewpoint": "V", "windDirection": "Z", "windSpeed": "Z", "windGust": "S", "barometricPressure": "V", "seaLevelPressure": "V", "visibility": "C", "precipitationLastHour": "C", "precipitationLast3Hours": "Z", "precipitationLast6Hours": "Z", "relativeHumidity": "V", "windChill": "V", "heatIndex": "V"}

The various codes are as follows:

| MADIS QC Information - Surface QC Data Descriptor Values                                     |                                                   |
|----------------------------------------------------------------------------------------------|---------------------------------------------------|
| No QC available                                                                              |                                                   |
| Z                                                                                            | Preliminary, no QC                                |
| Automated QC checks                                                                          |                                                   |
| C                                                                                            | Coarse pass, passed level 1                       |
| S                                                                                            | Screened, passed levels 1 and 2                   |
| V                                                                                            | Verified, passed levels 1, 2, and 3 (BEST)        |
| X                                                                                            | Rejected/erroneous, failed level 1                |
| Q                                                                                            | Questioned, passed level 1, failed 2 or 3, where: |
| Quality Levels                                                                               |                                                   |
| level 1 = validity                                                                           |                                                   |
| level 2 = internal consistency, temporal consistency, statistical spatial consistency checks |                                                   |
| level 3 = spatial consistency check                                                          |                                                   |


This information will give you some additional granularity with respect to how much you can trust the data.  Accessing this data using a script is pretty straightforward.

    import json

    dev = indigo.devices[12345678]
    codes = dev.states['qualityCodes']
    quality_codes = json.loads(codes)
    temp_quality = quality_codes['temperature']

    if temp_quality in ("X", "Q"):
        indigo.server.log("don't trust")
    else:
        indigo.server.log("trust")

## Weather Icons
### Weather Station and Current Condition Devices
You can link to the current condition icons in the "traditional" way. On a control page, select **Display Device State** and **Current Condition Icon**. Then select **As Image** and choose **NOAA Condition+.png**. This should work for both the Weather Station and Current Condition device types.

#### Forecast Devices
For Forecast icons, the reference is a bit different. NOAA provides a detailed description of the icon like, `/icons/land/day/tsra,30?size=medium`. The way to display these images is to link to them directly via the NOAA API itself. Select Display Refreshing Image URL, set the icon size you want (medium is 86x86) and then in the URL field, enter a URL which is a combination of text and a device state substitution. The text part is `https://api.weather.gov` and then append the substitution string for the state you want like `%%d:123456789:icon_01%%`. So the full URL would be:

`https://api.weather.gov%%d:123456789:icon_01%%`

(replacing 123456789 with your device ID and then the icon you want like icon_01, icon_02, etc.)

You can also construct refreshing image URLs for the current conditions icons, but the construction is a little different. The full URL for those would be something like, `https://api.weather.gov/icons/land/day/%%d:123456789:currentConditionIcon%%`.

If you want to have both day and night versions, you'd need to create a variable value that is equal to `day` when Indigo's `isDaylight` variable is true and equal to `night` when `isDaylight` is false. Then add a variable substitution for that part of the URL, like:

`https://api.weather.gov/icons/land/%%v:12345678%%/%%d:123456789:currentConditionIcon%%`.

For all these URLs, there's no need to refresh the images more than once every half hour or so because the NOAA plugin weather devices don't update more frequently than that on their own.

## Scripting Support
Here's the plugin ID in case you need to programmatically restart the plugin:

**Plugin ID**: com.perceptiveautomation.indigoplugin.NOAAWeather

## Support and Troubleshooting
For usage or troubleshooting tips [discuss this plugin](https://forums.indigodomo.com/viewforum.php?f=97) on our forum.
