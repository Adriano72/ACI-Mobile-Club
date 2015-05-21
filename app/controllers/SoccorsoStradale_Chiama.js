var args = arguments[0] || {};

var AciGlobal = require('aciglobal');


/**
 * Apre il telefono per chiamare il numero verde
 * @return {[type]} [description]
 */
function callPhone() {
    Titanium.Platform.openURL('tel:' + AciGlobal.NumeroVerde);
}