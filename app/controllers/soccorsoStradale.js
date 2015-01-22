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

console.log('isGuest', isGuest);
console.log('user', user);

if (!isGuest && user && user != {}) {

    utility.showVertical($.tipoWrapper);
    $.telefono.value = user['userInfo.mobile'] || user['userInfo.mobileTemp'];

} else {

    utility.hideVertical($.tipoWrapper);
    $.telefono.value = '';
}


$.tipoAiuto.addEventListener('change', function(e) {
    console.log('change', e);
});


//inizializzazione della mappa con la posizione corrente
$.mapview.addEventListener('complete', function() {
    //la posizione iniziale è quella dell'utente
    locationServices.getUserLocation(function(coo) {
        $.mapview.setLocation(coo);
        $.mapview.zoom(10);
    });
});


//logging, solo per test
$.mapview.addEventListener('regionchanged', function(e) {
    console.log('centro mappa: ', $.mapview.getRegion());
});


//serve ad evitare il problema che la tastiera viene visualizzata all'apertura
if (OS_ANDROID) {
    $.telefono.once('focus', function() {
        $.telefono.blur();
    });
}