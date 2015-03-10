var args = arguments[0] || {};
var commons = require('commons');

var AciGlobal = require('aciglobal');


var headerText = "Assistenza";
var headerImg = "/images/ic_action_home_assistenza_blu.png";

//inizializzazioni comuni della Window
commons.initWindow($.win, headerText, headerImg);



/**
 * Apre il telefono per chiamare il numero verde
 * @return {[type]} [description]
 */
function callPhone() {
    Titanium.Platform.openURL('tel:' + AciGlobal.NumeroVerde);
}