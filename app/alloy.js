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

Alloy.Globals.DevMode = Boolean(Alloy.CFG.DevMode);
console.log('Alloy.CFG.DevMode', Alloy.CFG.DevMode);
console.log('Alloy.Globals.DevMode', Alloy.Globals.DevMode);

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
Alloy.Globals.baseURL = Alloy.CFG.AciGeo_BaseUrl;
Alloy.Globals.bannerBaseURL = Alloy.CFG.AciGeo_BannerBaseUrl;
Alloy.Globals.PuntiAciBannerBaseURL = Alloy.CFG.AciGeo_PuntiAciBannerBaseUrl;

console.log('platformWidth ', Ti.Platform.displayCaps.platformWidth);
console.log('logicalDensityFactor ', Ti.Platform.displayCaps.logicalDensityFactor);

Ti.API.info('globals 2: ' + JSON.stringify(Alloy.Globals));


//SERVIZI GIC
Alloy.Collections.instance("serviziGIC");
Alloy.Collections.instance("serviziGICpos");

//province
Alloy.Collections.instance("province");

//tessere
Alloy.Collections.instance("tessere");

//banner
Alloy.Collections.instance("banner");

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
Alloy.Collections.instance("casa");
Alloy.Collections.instance("auto");
Alloy.Collections.instance("benessereSalute");
Alloy.Collections.instance("mobilita");
Alloy.Collections.instance("tempoLibero");
Alloy.Collections.instance("shopping");
Alloy.Collections.instance("culturaSpettacoli"); //da togliere
Alloy.Collections.instance("noleggiTrasporti"); //da togliere
Alloy.Collections.instance("sportEventi");
Alloy.Collections.instance("altriServizi");

//Ti.API.info("WINDOW HEIGHT:"+Ti.Platform.displayCaps.platformHeight);


//palette di colori da utilizzare nell'app
Alloy.Globals.palette = {
    blu: "#003772",
    celeste: "#006cb2",
    grigio: "#d1d0d5",
    grigio_chiaro: "#f1f0f5",
    grigio_scuro: "#888888",
    rosso: "#e32b00",
    bianco_sporco: "#f9f9f9", //header e 
    bianco: "#ffffff"
};

//font
Alloy.Globals.font = {
    ACIType_Bold: OS_IOS ? 'ACIType-Bold' : 'ACI Type Bold',
    ACIType: OS_IOS ? 'ACIType' : 'ACI Type Regular',
    PTSans_NarrowBold: OS_IOS ? 'PTSans-NarrowBold' : 'PT_Sans-Narrow-Web-Bold',
    PTSans_Narrow: OS_IOS ? 'PTSans-Narrow' : 'PT_Sans-Narrow-Web-Regular',
    PTSans_Bold: OS_IOS ? 'PTSans-Bold' : 'PT_Sans-Web-Bold',
    PTSans: OS_IOS ? 'PTSans' : 'PT_Sans-Web-Regular'

};

var baseFontSize = OS_IOS ? 10 : 12;
Alloy.Globals.fontSize = {
    XS: baseFontSize,
    S: baseFontSize + 2,
    M: baseFontSize + 3,
    L: baseFontSize + 5,
    XL: baseFontSize + 6,
    XXL: baseFontSize + 7,
    XXXL: baseFontSize + 9
};


//inizializza i servizi di location
_.defer(require('locationServices').init);