var args = arguments[0] || {};

var AciGlobal = require('aciglobal');


if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};



function doopen(evt) {
    if (OS_ANDROID) {

        init1();


    } else {
        //$.windowtitle.text = winTitle;

        //salto l'init del menu
        init3();
    }

    //updateScreen();
}

function init1() {
    //  abx.displayHomeAsUp = true;
    abx.title = "Assistenza";
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = "#003772";
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();

}


/**
 * Apre il telefono per chiamare il numero verde
 * @return {[type]} [description]
 */
function callPhone() {
    Titanium.Platform.openURL('tel:' + AciGlobal.NumeroVerde);
}