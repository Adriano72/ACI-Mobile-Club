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


//questo deve stare qui, altrimento non funziona... non capisco ma mi adeguo
var net = require('network');

//
// ## Alloy.Globals
//

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

Alloy.Globals.baseURL = Alloy.CFG.AciGeo_BaseUrl;
Alloy.Globals.bannerBaseURL = Alloy.CFG.AciGeo_BannerBaseUrl;
Alloy.Globals.PuntiAciBannerBaseURL = Alloy.CFG.AciGeo_PuntiAciBannerBaseUrl;

console.log('platformWidth ', Ti.Platform.displayCaps.platformWidth);
console.log('logicalDensityFactor ', Ti.Platform.displayCaps.logicalDensityFactor);




//### isLogged
//questa proprietà globale ci dice se l'utente è loggato o meno
Object.defineProperty(Alloy.Globals, "isLogged", {
    get: function() {
        return require('user').isLogged;
    }
});



//### isLongDevice
//Questa proprietà globale ci dice se il device ha una proporzione larghezza/altezza allungata o meno.
//Per esempio, iphone5 è considerato lungo, mentre iphone4 no
Object.defineProperty(Alloy.Globals, "isLongDevice", {
    get: function() {
        var v = (Alloy.Globals.deviceHeight / Alloy.Globals.deviceWidth) > 1.5;
        console.log('isLongDevice', v);
        return v;
    }
});


// ### palette
//palette di colori da utilizzare nell'app
Alloy.Globals.palette = {
    nero: "#000000",
    blu: "#003772",
    celeste: "#006cb2",
    grigio: "#d1d0d5",
    grigio_chiaro: "#f1f0f5",
    grigio_scuro: "#888888",
    rosso: "#e32b00",
    bianco_sporco: "#f9f9f9", //header e 
    bianco: "#ffffff",
    verde: "#008100"
};

// ### font
// I diversi font definiti nell'app
Alloy.Globals.font = {
    ACIType_Bold: OS_IOS ? 'ACIType-Bold' : 'ACI Type Bold',
    ACIType: OS_IOS ? 'ACIType' : 'ACI Type Regular',
    PTSans_NarrowBold: OS_IOS ? 'PTSans-NarrowBold' : 'PT_Sans-Narrow-Web-Bold',
    PTSans_Narrow: OS_IOS ? 'PTSans-Narrow' : 'PT_Sans-Narrow-Web-Regular',
    PTSans_Bold: OS_IOS ? 'PTSans-Bold' : 'PT_Sans-Web-Bold',
    PTSans: OS_IOS ? 'PTSans' : 'PT_Sans-Web-Regular'

};

// ### fontSize
// Le classi di grandezza dei testi dell'app
var baseFontSize = OS_IOS ? 12 : 14;
Alloy.Globals.fontSize = {
    XS: baseFontSize,
    S: baseFontSize + 2,
    M: baseFontSize + 3,
    L: baseFontSize + 5,
    XL: baseFontSize + 6,
    XXL: baseFontSize + 7,
    XXXL: baseFontSize + 9
};



//
// ## Collections
//

// ### serviziGIC
Alloy.Collections.instance("serviziGIC");
// ### serviziGICpos
Alloy.Collections.instance("serviziGICpos");
// ### province
Alloy.Collections.instance("province");
// ### tessere
Alloy.Collections.instance("tessere");
// ### banner
Alloy.Collections.instance("banner");
// ###  automobileClub
Alloy.Collections.instance("automobileClub");
// ###  delegazioni
Alloy.Collections.instance("delegazioni");
// ###  pra
Alloy.Collections.instance("pra");
// ###  urp
Alloy.Collections.instance("urp");
// ###  tasse
Alloy.Collections.instance("tasse");
// ###  demolitori
Alloy.Collections.instance("demolitori");
// ###  autoscuole
Alloy.Collections.instance("autoscuole");
// ###  acipoint
Alloy.Collections.instance("acipoint");
// ###  dormireMangiare
Alloy.Collections.instance("dormireMangiare");
// ###  casa
Alloy.Collections.instance("casa");
// ###  auto
Alloy.Collections.instance("auto");
// ###  benessereSalute
Alloy.Collections.instance("benessereSalute");
// ###  mobilita
Alloy.Collections.instance("mobilita");
// ###  tempoLibero
Alloy.Collections.instance("tempoLibero");
// ###  shopping
Alloy.Collections.instance("shopping");
// ###  culturaSpettacoli
Alloy.Collections.instance("culturaSpettacoli"); //da togliere
// ###  noleggiTrasporti
Alloy.Collections.instance("noleggiTrasporti"); //da togliere
// ###  sportEventi
Alloy.Collections.instance("sportEventi");
// ###  altriServizi
Alloy.Collections.instance("altriServizi");
// ###  sycLatest
Alloy.Collections.instance("sycLatest");

Alloy.Collections.tempCollection = new Backbone.Collection();



/**
 * ## ApplicationStart
 * Routine da eseguire all'application start
 */
(function ApplicationStart() {


    //inizializza i servizi di location
    _.defer(require('locationServices').init);

    //ricarica i dati utente
    _.defer(require('user').refreshData);

    //abilita/disabilita la fuonzionalità di segnalazione errore
    if (Alloy.CFG.SysReport_Enabled && Alloy.CFG.SysReport_UseShake) {
        require('sysReportCommon').enableShake();
    }
})();