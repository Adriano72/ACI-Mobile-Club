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

var net = require("network");

Alloy.Globals.rememberMe = false;

Alloy.Globals.DevMode = ENV_DEV;

Alloy.Globals.tesserafontSize = (Ti.Platform.displayCaps.platformHeight <= 480) ? '11dp' : '15dp';

Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");

var logicalDensityFactor = OS_IOS ? 1 : Ti.Platform.displayCaps.logicalDensityFactor;
Alloy.Globals.deviceWidth = parseInt(Ti.Platform.displayCaps.platformWidth / (logicalDensityFactor || 1), 10);
Alloy.Globals.deviceWidthHalf = Alloy.Globals.deviceWidth / 2;
Alloy.Globals.deviceHeight = parseInt(Ti.Platform.displayCaps.platformHeight / (logicalDensityFactor || 1), 10);
Alloy.Globals.deviceHeightHalf = Alloy.Globals.deviceHeight / 2;

Alloy.Globals.menuButtonsWidth = Alloy.Globals.deviceWidthHalf - 5;
Alloy.Globals.menuButtonsHeight = (OS_ANDROID) ? (Alloy.Globals.deviceHeight / 4) - 22 : (Alloy.Globals.deviceHeight / 4) - 20;
//Alloy.Globals.baseURL = "http://10.64.4.199:9900/api";
Alloy.Globals.baseURL = "http://www.aci.it/geo/v2";
Alloy.Globals.bannerBaseURL = "http://www.aci.it/fileadmin/syc/banner/";

console.log('platformWidth ', Ti.Platform.displayCaps.platformWidth);
console.log('logicalDensityFactor ', Ti.Platform.displayCaps.logicalDensityFactor);

Ti.API.info('globals 2: ' + JSON.stringify(Alloy.Globals));


//SERVIZI GIC
Alloy.Collections.instance("serviziGIC");
Alloy.Collections.instance("serviziGICpos");

//province
Alloy.Collections.instance("province");


// PUNTI ACI
Alloy.Collections.instance("automobileClub");
Alloy.Collections.instance("delegazioni");
Alloy.Collections.instance("pra");
Alloy.Collections.instance("urp");
Alloy.Collections.instance("tasse");
Alloy.Collections.instance("demolitori");

//Alloy.Collections.instance("puntiMappa");

Alloy.Collections.tempCollection = new Backbone.Collection();

//SYC
Alloy.Collections.instance("dormireMangiare");
Alloy.Collections.instance("tempoLibero");
Alloy.Collections.instance("culturaSpettacoli");
Alloy.Collections.instance("noleggiTrasporti");
Alloy.Collections.instance("sportEventi");
Alloy.Collections.instance("altriServizi");

//Ti.API.info("WINDOW HEIGHT:"+Ti.Platform.displayCaps.platformHeight);


//palette di colori da utilizzare nell'app
Alloy.Globals.palette = {
    blu: "#003772",
    celeste: "#006db3",
    grigio_chiaro: "#cccccc", // (separatori orizzontali, freccia menu
    grigio_scuro: "#888888",
    rosso: "#e32b00",
    bianco_sporco: "#f2f2f2",//header e 
    bianco: "#ffffff" 
};