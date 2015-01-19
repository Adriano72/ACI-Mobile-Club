var locationServices = require('locationServices');
var utility = require('utility');


var args = arguments[0] || {};

if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};

/**
 * apre il telefono e chiama il numero verde
 * @return {[type]} [description]
 */
function phoneCall() {
    console.log('phone call');
    Ti.Platform.openURL('tel:+803116');
}

function doopen(evt) {
    if (OS_ANDROID) {

        init1();

    } else {
        //$.windowtitle.text = winTitle;
    }

    //updateScreen();
}

function init1() {
    //  abx.displayHomeAsUp = true;
    abx.title = "Soccorso Stradale";
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = "#003772";
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
}

function chiamaSoccorso() {
    Titanium.Platform.openURL('tel:803116');
}



//controllo lo stato della login
var isGuest = !Ti.App.Properties.getBool("utenteAutenticato");
var user = Ti.App.Properties.getObject("datiUtente");
if (isGuest) {

    utility.showVertical($.socioWrapper);
    utility.hideVertical($.lbUser);

} else {

    utility.hideVertical($.socioWrapper);
    utility.showVertical($.lbUser);
    $.lbUser.text = ['Ciao', user['userInfo.name'], user['userInfo.surname'], ','].join(' ');
}


$.tipoAiuto.addEventListener('change', function(e) {
    console.log('change', e);
});


//inizializzazione della mappa con la posizione corrente
$.mapview.addEventListener('complete', function() {
    //la posizione iniziale è quella dell'utente
    locationServices.getUserLocation(function(coo) {
        $.mapview.setLocation(coo);
    });
});


//logging, solo per test
$.mapview.addEventListener('regionchanged', function(e) {
    console.log('centro mappa: ', $.mapview.getRegion());
});


