# dcs-login
A login component for DCS

## Development Notes

This package is *not* intended to be headless. Because it is designed specifically for DCS login and authentication, this package will implement the UI/X with branding appropriate for unfoldingWord's applications.

The single demo page will exhibit how to use and how to handle errors.

All errors will be thrown, thus the app must catch them.

There will be a number of properties needed for this component to function properly.

The initial checkin of the code includes bits and pieces from gateway-translate (the login form and logic) and from translation-helps-rcl (mostly styleguidist structure). The initial checking will have more than it needs and as development proceeds, the excess will be trimmed.