var args = arguments[0] || {};
var commons = require('commons');

//inizializzazioni comuni della Window
commons.initWindow($.win, "Le tessere ACI", "/images/ic_action_home_tessera_blu.png");




$.win.addEventListener('close', function() {
    $.destroy();
});