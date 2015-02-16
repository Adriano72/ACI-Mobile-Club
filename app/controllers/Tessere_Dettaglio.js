var args = arguments[0] || {};

Ti.API.info("MODELLO: " + JSON.stringify(args));

var encoder = require('encoder');


var modelGot = args.data;


Ti.API.info("DATI: " + JSON.stringify(modelGot));

$.tessera.set(modelGot);

if (OS_IOS) {
    $.titleControl.text = "Tessera " + modelGot.name;
}

if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {
    if (OS_ANDROID) {

        init1();

    } else {
        $.titleControl.backgroundImage = args.headerImg;

    }

    //updateScreen();
}

function init1() {
    abx.displayHomeAsUp = true;
    abx.title = "Tessera " + modelGot.name;
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = Alloy.Globals.palette.blu;
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
}




function onDetail() {
    Ti.Platform.openURL(modelGot.detailUrl);
}

function onBuy() {
    Ti.Platform.openURL(modelGot.buyUrl);

}