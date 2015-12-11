var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');


//inizializzazioni comuni della Window
commons.initWindow($.win, 'Registrazione completata', null, []);


function primaryAction(){
	$.win.close();
}