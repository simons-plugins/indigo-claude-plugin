<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/configui/dialog-close/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Dialog Close Notification { .ref-head-no-code #dialog-close-notification }

So you know that when the user clicks the "Save" button in the dialog, your validation method will get called (if it exists). But, what if your dialog starts some separate thread (perhaps as a result of a button click), then the user clicks the "Cancel" button? You still need to know to stop the thread that's doing something, right? There is another, final method that's called at the very end of the dialog's lifecycle. It's very similar to the validation method, but with an additional parameter that tells you whether the user canceled the dialog. Here are the various closed notification methods:

<span class="ca">**Dialog Types**</span>

| Dialog Type  | Method Signature                                                                                     |
|--------------|------------------------------------------------------------------------------------------------------|
| device       | <span class="nw cb">`closedDeviceConfigUi(self, valuesDict, userCancelled, typeId, devId)`</span>    |
| event        | <span class="nw cb">`closedEventConfigUi(self, valuesDict, userCancelled, typeId, eventId)`</span>   |
| action       | <span class="nw cb">`closedActionConfigUi(self, valuesDict, userCancelled, typeId, actionId)`</span> |
| PluginConfig | <span class="nw cb">`closedPrefsConfigUi(self, valuesDict, userCancelled)`</span>                    |

The parameters are exactly the same as in the [validation methods](validation.md#validation-methods) with the addition of `userCancelled` - which is a boolean. We're sure there are other reasons why one would need to know when the dialog closes so we wanted to make sure that the complete lifecycle of the dialog was exposed to you. 

!!! note
    The parameters in this instance are all read-only. If you need to modify the valuesDict, for instance, you need to do it in the validate UI (which is fine since a cancel should never change anything).
