// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.deviceWidth = parseInt(Ti.Platform.displayCaps.platformWidth / (Ti.Platform.displayCaps.logicalDensityFactor || 1), 10);
Alloy.Globals.deviceWidthHalf = Alloy.Globals.deviceWidth / 2;
Alloy.Globals.deviceHeight = parseInt(Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.logicalDensityFactor || 1), 10);
Alloy.Globals.deviceHeightHalf = Alloy.Globals.deviceHeight / 2;

Alloy.Globals.menuButtonsWidth = Alloy.Globals.deviceWidthHalf-5;
Alloy.Globals.menuButtonsHeight = (OS_ANDROID)?(Alloy.Globals.deviceHeight/4)-22:(Alloy.Globals.deviceHeight/4)-20;
