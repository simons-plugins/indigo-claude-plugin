<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/remote-access/reflector/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# The Indigo Reflector Service

!!! abstract "In this guide"
    How to activate and use the Indigo Reflector Service for secure remote access to your Indigo server — no router port forwarding, static IP, or DynDNS account required. Covers reflector activation, the personalized remote URL, and how Indigo Touch automatically switches between local Bonjour and remote reflector access.

## About Reflectors
[Indigo Reflectors](http://www.indigodomo.com/account/reflectors/) are a service that gives you secure (HTTPS) remote access from anywhere to your Indigo Server **with no network configuration needed.** This is particularly useful for those of us that have dynamic (vs. static) IP addresses at home, or that have routers or networks that are difficult to configure for remote access to your Mac running Indigo.

![Reflector Flow Image](../../images/reflector_flow_image.png)

Reflectors work by routing communication from [Indigo Touch for iOS](https://www.indigodomo.com/touch.html), [Domotics Pad for Android](https://play.google.com/store/apps/details?id=com.duncanware.domoPad), [Indigo Touch for Web browsers](https://www.indigodomo.com/touch.html), and from external services like [Amazon Alexa](../../plugins/alexa/index.md), through our hosted systems to your Indigo Server. We do this through a secure tunnel between our hosted systems and your Indigo Server (even we don't see the unencrypted traffic).

Your purchase of Indigo includes an [Indigo Up-to-Date subscription](http://www.indigodomo.com/blog/2016/11/09/indigo-date/), which itself includes reflector access. If you have an active Up-to-Date subscription, you can have a reflector!

Reflectors provide:

- Personalized easy-to-remember URL when using [Indigo Touch](http://www.indigodomo.com/touch.html) for the Web
- [Indigo Touch](http://www.indigodomo.com/touch.html) for iOS (iPhone, iPad, etc.) and for the Web can access your Indigo Server from anywhere in the world
- [Indigo Touch](http://www.indigodomo.com/touch.html) for iOS enabled – automatic switching between local Bonjour access and remote reflector access
- 3rd party services like Amazon Alexa can get secure, authenticated access to your Indigo Server to open up a broad range of integration possibilities.
- Complete remote access solution (much more than just a dynamic IP address mapping service)
- Fully encrypted (256-bit) communication
- Hassle free setup:
    - No firewall configuration needed
    - No router port forwarding needed
    - No static IP address or DynDNS account needed
    - No non-standard port numbers to remember
    - No reverse proxies to implement SSL/HTTPS

## Activating your Reflector
Activating a reflector is fast and easy. First, make sure you are running Indigo version 7.0.0 or greater(both client and server -- check the About Box). Next:

1. Choose the `Indigo->Start Local Server...` menu item.
1. Turn on the `Allow remote access` checkbox and enter a Username and good Password. You will *definitely* want password authentication on since you are about to enable access to the Indigo web server from the Internet.
1. Turn on the `Enable secure internet access via Indigo Reflector` checkbox.
1. Press the `Activate Reflector` button.

A browser page will open to the http://www.indigodomo.com/account/codes/ page listing your registration codes.

- If you already have an Indigo Account then log in (if necessary). You'll then be redirected to the registration codes page.
- If you don't have an Indigo Account then create one by clicking on the `Sign up` link below the login form. When you create an account, we'll send you an activation email that contains a link to activate your account. When you click that link, it will switch you back to your browser and open the reflectors page. If for some reason it doesn't, switch back to Indigo and click the `Activate Reflector` button again and it will.

Once on the registration codes list page, you'll see a message to click the **Create Reflector** link next to your Indigo registration code. Click on that link and you'll switch to the Reflectors page with a form field to enter your reflector name. When you submit that we will create the reflector, activate it, and take you back to the codes page which will show your reflector activated.

Lastly, switch back to the Indigo `Start Local Server...` dialog. It should now show that the reflector status is activated and will show a link to your new reflector URL. Press the `Start Server` button and that is it – Indigo will restart and automatically connect to your reflector! To access from the web, simply go to `https://YOUR-REFLECTOR-NAME.indigodomo.net/`.

You can now access Indigo web pages from anywhere using your personalized URL. No firewall settings changes, router port forwarding, etc. is needed. And even if your IP address changes, Indigo will automatically make sure that a new connection is re-established within just a few minutes.

Your reflector will be active as long as you maintain an active Indigo Up-to-Date subscription.

## Reset Your Reflector's Activation { #reset-your-reflector-s-activation }
If you are switching to a different reflector that you've asked us to create for you, or you've been instructed by support to reset your current reflector's activation, then follow these steps:

1. Shut down the Indigo Server (select `Indigo {{ version }}->Stop Server`) but don't quit the Indigo Client
1. Switch to your browser and [log out of your Indigo Account](http://www.indigodomo.com/account/logout/)
1. Go to the [reflector list](http://www.indigodomo.com/account/reflectors/) in your Indigo Account (you'll need to log back in) and click the `Reset` link beside your reflector's status (it should say *Activated* before your press *Reset*)
1. Switch back to the Indigo Client and click on the `Start Local Server` button

You should now see an `Activate Reflector` button towards the bottom of the dialog. Click that, log in to your reflector account, and select the appropriate reflector. If the reflector you want to use doesn't show in the list of inactive reflectors, [contact us](http://www.indigodomo.com/#contact) with the name of the reflector you're trying to activate and what steps you've performed.

### Manual Reset
If the procedure above doesn't work, and *​only* ​if instructed by support, follow these steps to manually reset your Indigo Client reflector settings:

1. Shut down the Indigo Server (select `Indigo {{ version }}->Stop Server`) but don't quit the Indigo Client
1. Switch to your browser and [log out of your Indigo Account](http://www.indigodomo.com/account/logout/)
1. Go to the [reflector list](http://www.indigodomo.com/account/reflectors/) in your Indigo Account (you'll need to log back in) and click the `Reset` link beside your reflector's status (it should say *Activated* before your press *Reset*). If the reflector has already been deactivated that is fine – just skip this step.
1. In the Finder, select `Go->Go to Folder…`
1. In the resulting dialog, copy and paste the following: `/Library/Application Support/Perceptive Automation/Indigo {{ version }}/Preferences/`
1. In the resulting Finder window, delete the folder named `PrismReflector`
1. Switch back to the Indigo Client and click on the `Start Local Server` button

## Indigo Touch and Your Reflector
[Indigo Touch](http://www.indigodomo.com/touch.html) for iOS is transparently integrated with the Indigo Reflector service. When you use your iOS device (iPhone, iPad, etc.) to connect to Indigo while in your house (and on your local Wi-Fi network), Indigo Touch will automatically retrieve and remember your reflector address. You can press the settings (gear) icon on the top toolbar then find the `Reflector` item near the bottom to verify that it is working correctly.

Once Indigo automatically detects your reflector address, it will seamlessly change between using the local Bonjour detected address and the remote reflector address. Just launch Indigo Touch and it works, no matter where you are!

## Bandwidth Limits
Because using a reflector has to bounce all requested files to and from our server, monthly bandwidth usage cannot be unlimited. Reflectors that exceed an average bandwidth of approximately 200 MB per day may have temporary limitations or throttles imposed, but a vast majority of the time bandwidth is not an issue. There are a couple of things that can lead to excessive bandwidth usage. So please consider:

- If you have a graphical Control Page in Indigo that uses the `Refreshing Image` control type then use a longer refresh duration (30 minutes or longer) for the image, especially if you plan to frequently access the page remotely.

- Not leaving Indigo Touch or an Indigo web browser page running continuously while not viewing it. By closing the browser window or leaving Indigo Touch (home button), the requests through the reflector will stop which significantly reduces daily bandwidth usage.

Note these usage suggestions only apply to connections when a reflector is being used. If you are directly connected to your Indigo Server on your home network or not using a reflector then the bandwidth isn't going through our servers and you can have Control Page images refreshed as frequently as you would like.

## Troubleshooting
In this section you'll find information on troubleshooting any reflector errors/issues you may be experiencing.

If you see any of the following errors in the Event Log window, do as described to resolve the issue.

- <span class="dw-color-red">failed to create reflector connection: reflector not active</span> - try the steps above to [reset your reflector's activation](#reset-your-reflector-s-activation)
- <span class="dw-color-red">reflector connection test failed: local server unreachable</span> - check [this forum post](https://forums.indigodomo.com/viewtopic.php?f=131&t=27344) for the likely causes.
- <span class="dw-color-red">Unable to authenticate with IndigoDomo.com (server might be down temporarily for maintenance)</span> - you may be able to resolve the issue by:
    1. shutting down the Indigo Server,
    1. deleting the registration file located at *`/Library/Application Support/Perceptive Automation/Indigo {{ version }}/Preferences/Indigo Registration.indiPref`*,
    1. restarting the Indigo Server, and
    1. when prompted, enter your Indigo Account information.

Reflectors may also be affected by a bad entry in your *`/etc/hosts`* file. [Check this forum post for details](https://forums.indigodomo.com/viewtopic.php?t=27344).

### Advanced Troubleshooting
If nothing else works or if directed by Indigo support, [create a new topic in the reflectors forum](https://forums.indigodomo.com/viewforum.php?f=10) detailing what you've tried and do the following:

1. Launch the Terminal application (inside *`/Applications/Utilities/`*)

2. Copy/paste each line below *individually* and hit the return key after each one:

  id
  cd /Library/Application\ Support/Perceptive\ Automation
  cd Indigo\ {{ version }}/IndigoServer.app/Contents/Resources/PlugIns/
  ps -axww | grep "Indigo"
3. Select the entire results of the Terminal window (CMD-A) and copy/paste into Code tags (the icon that looks like this: *`</>`*).

4. Copy/paste each line below *individually* into the Terminal window and hit the return key after each one:

  ./reflector_library_stub.py -m geturl -d
  ./reflector_library_stub.py -m tunnel -d

5. Wait 3 minutes. It can take a while for the network errors we are trying to catch to be reported. Then enter again:

  ps -axww | grep "Indigo"

6. Select the entire contents of the Terminal window (CMD-A) again and copy/paste results into another section with Code tags.
