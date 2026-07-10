<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/sql_logger/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# SQL Logger Plugin
The SQL Logger Plugin for Indigo automatically logs device state changes, variable value changes, and event log entries to either [PostgreSQL](http://www.postgresql.org/) or [SQLite](http://www.sqlite.org//).

This allows Indigo to integrate with other applications or services, and allows for historical data recording. You can, for example, use PHP to dynamically generate graphs or charts of device states (like temperature) stored in a PostgreSQL database.

By default, OS X 10.5 and higher includes the libraries needed to use SQLite, which makes using the SQLite option fast.

Although more complicated, we have also put together basic instructions for using the more powerful PostgreSQL database server.

## Configuring SQL Logger with SQLite
Choose the `Plugins->SQL Logger->Configure...` menu item, then select `SQLite` as the database type.

By default, Indigo will create a SQLite database file inside the logs folder:

`/Library/Application Support/Perceptive Automation/Indigo 6/Logs/indigo_history.sqlite`

### Configuring SQL Logger with PostgreSQL
PostgreSQL is not included with the Mac OS X install (note it is included on more recent OS X Server installs), but it is free and there are some package installers available. Here are the basic steps for installing it:

- Download a [PostgreSQL installer](https://www.postgresql.org/download/macosx/). Note there are other installers available elsewhere as well.
- Add the path to the PostgreSQL binary to your bash profile file. From the Terminal copy/paste:
`echo 'export PATH=$PATH:/Library/PostgreSQL/bin' >> ~/.bash_profile`

- Next, open the System Preferences and choose the PostgreSQL Server icon that was added. You should now be able to start the server. Note that some installers seem to include a Server Manage.app application, but they may not work correctly. However, the panel in the System Preferences does appear to work.
- From the command line you can now try to connect to the server via:
`psql -U postgres`

- Next, select the `Plugins->SQL Logger->Configure...` menu item, then select `PostgreSQL` as the database type.

By default, Indigo will connect to the PostgreSQL server running on the same Mac (`127.0.0.1`) using the default PostgreSQL username of `postgres`, and will automatically create a new database named `indigo_history`. Your PostgreSQL install might also support local connections directly using the host name `/var/pgsql_socket/.s.PGSQL.5432`.

### Logging Options
From the SQL Logging configuration dialog (`Plugins->SQL Logger->Configure...` menu item), you can choose which information the plugin should store in the database and specify if older data should automatically be pruned:

![Plugin SQL Logger Configuration Image](../images/plugin_sqllogger_config1.png)

Automatically pruning data from the tables will help keep the database size more manageable, but you can turn the option off if you want to manually clean up the database.

Auto deleting unused tables will have the plugin remove any tables for devices or variables that are not defined in the current Indigo database. However, note that this means that if you switch Indigo database files then the device and variable history stored for the previous database will automatically be deleted from the SQLite/PostgreSQL databases. So turn these options off if you use multiple Indigo databases.

### Database Table Format
Indigo creates a unique table for every device and variable to track its state/value history. Example database table names include:

`device_history_9734822, device_history_12452348, device_history_8734522`
and
`variable_history_9872345, variable_history_3411246`

To find the specific device or variable IDs used in the table name, right-click on the device (or variable) inside Indigo and choose the `Copy ID` menu item. Note the SQL Logger also writes to the Event Log any time it creates a new table and shows what table name was created for a specific device or variable.

Columns are automatically created for the tables for every state used by that particular device. For example, here is the device history table for a dimmer switch, `device_history_9734822`:

| ts                  | brightnesslevel | onoffstate |
|---------------------|-----------------|------------|
| 2012-05-16 16:00:32 | 0               | f          |
| 2012-05-16 16:01:44 | 74              | t          |
| 2012-05-16 16:01:44 | 29              | t          |
| 2012-05-16 16:44:46 | 0               | f          |
| 2012-05-16 16:45:03 | 29              | t          |
| 2012-05-16 16:45:35 | 0               | f          |
| 2012-05-16 18:20:09 | 28              | t          |
| 2012-05-16 19:01:57 | 29              | t          |
| 2012-05-16 19:15:12 | 38              | t          |
| 2012-05-16 19:15:13 | 48              | t          |


And here is the table created for a temperature humidity sensor, `device_history_12452348`:

| ts                  | temperature | humidity |
|---------------------|-------------|----------|
| 2012-05-16 16:00:32 | 73          | 85       |
| 2012-05-16 16:01:44 | 74          | 85       |
| 2012-05-16 16:01:44 | 73          | 85       |
| 2012-05-16 16:44:46 | 72          | 86       |
| 2012-05-16 16:45:03 | 71          | 87       |
| 2012-05-16 16:45:35 | 68          | 87       |
| 2012-05-16 18:20:09 | 65          | 88       |
| 2012-05-16 19:01:57 | 67          | 87       |
| 2012-05-16 19:15:12 | 68          | 86       |
| 2012-05-16 19:15:13 | 69          | 86       |


Using SQL you can query the table for all the defined columns.

Variable tables are similarly created -- one table per variable. However, they always have the same columns: `ts` and `value`. Here is an example table tracking a variable for alarmMode:

| ts                  | value    |
|---------------------|----------|
| 2012-05-16 16:00:32 | Idle     |
| 2012-05-16 16:01:44 | Arm Home |
| 2012-05-16 16:01:44 | Idle     |
| 2012-05-16 16:44:46 | Arm Away |


Lastly, a single table is created to track all event log entries, `eventlog_history`.

### Example Queries
Below are some example SQLite and PostgreSQL queries. Note that the table names below are examples, and must be modified to match your unique table names.

#### PostgreSQL Queries
PostgreSQL query to retrieve all event log history:
`psql indigo_history postgres -c "SELECT * FROM eventlog_history;"`
PostgreSQL query to retrieve all device history for a specific device:
`psql indigo_history postgres -c "SELECT * FROM device_history_692773228;"`
PostgreSQL query to retrieve the timestamp, rain rate and rain total from an Oregon Scientific rain sensor:
`psql indigo_history postgres -c "SELECT ts, rainrate, raintotal, currentdaytotal FROM device_history_849210623;"`

#### SQLite Queries
For SQLite queries, first change to the directory in which the database file resides:
`cd /Library/Application\ Support/Perceptive\ Automation/Indigo\ 6/Logs/`

SQLite query to retrieve all event log history:
`sqlite3 -header -column indigo_history.sqlite "SELECT * FROM eventlog_history;"`
SQLite query to retrieve all device history for a specific device:
`sqlite3 -header -column indigo_history.sqlite "SELECT * FROM device_history_692773228;"`
SQLite query to retrieve the timestamp, temperature, and humidity from an Oregon Scientific sensor:
`sqlite3 -header -column indigo_history.sqlite "SELECT datetime(ts,'localtime'), temperature, humidity FROM device_history_167703743;"`

Note that when selecting the timestamp from a SQLite table you must use the notation `datetime(ts,'localtime')` so that the internally stored GMT time is translated to your local time.

## Events
![SQL Logger Event Image](../images/plugin_sqllogger_event.png)

The SQL Logger provides a useful event (even if it's not logging anything): `Error in Event Log`. This event will fire whenever an error (generated by the Indigo Server, by plugins, or both) appears in the event log. You can perform any actions (like sending an email, etc.).

`Indigo Internal Errors` are errors generated by the IndigoServer directly - so errors from Insteon and X10 devices, errors with the built-in actions/events (sending emails), etc. These do not include errors that plugins generate or errors that are inserted from scripts.

To use the `Specific Type` event type, you'll need to use the error type that's shown in the event log window. The error type is the beginning part of an event log line. Each event log entry has a beginning part, then a series of spaces, then the message. The beginning part is the event type. Error event types will always end in the word "Error". Here are some examples:

```text
Aug 9, 2012 3:38:10 AM
  My Type Error                   this is an error from a script
  NOAA Weather Plus Error         Error parsing XML from NOAA for device Weather Forecast: not well-formed (invalid token): line 1, column 111
```

In the configuration dialog for `Error in Event Log`, when you select `Specific Type` from the `Errors to monitor for:` popup, a text field with the label `Event Type` will show. You'll enter the text shown above - so for instance if you want to monitor for the first error, you'd enter "My Type Error" in the text field (notice no spaces/tabs before or after). Then, every time an error of that type is detected by the SQL Logger plugin, it will fire that trigger.

This is primarily useful for plugin errors although if you have scripts that generate errors it could be used for those as well. For plugins (unless the developer decides otherwise), errors will be generated using the plugin's name with " Error" appended.

You can enter text in the String to Match field and the action will attempt to match it against the text in the log message. For instance, entering *Office Lamp* in the field will cause the event to fire only if "Office Lamp" is in the field (case-sensitive). You can also specify a regular expression for more advanced text matching.

## Scripting Support
Here's the plugin ID in case you need to programmatically restart the plugin:

**Plugin ID**: com.perceptiveautomation.indigoplugin.sql-logger

## Support and Troubleshooting
For usage or troubleshooting tips [discuss this plugin](https://forums.indigodomo.com/viewforum.php?f=98) on our forum.
