var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');



//Handler per la telefonata
var doPhoneCall = commons.doPhoneCall;
//Handler per l'invio email
var doSendEmail = commons.doSendEmail;


//inizializzazioni comuni della Window
commons.initWindow($.win, args.titolo, args.headerImg, [{
    icon: OS_IOS ? "/images/ic_action_gps.png" : "/images/x_menu_gps_blu.png",
    onClick: function() {
        console.log('	open nav', $.detailModel);
        var location = $.detailModel.get('address').location;
        commons.openNavigation({
            lat: location[1],
            lon: location[0]
        });
    }
}]);


//carica i dati
loadData();


function loadData() {
    var utility = require('utility');
    var modelGot;
    if (args.fromMap) {
        modelGot = args.data;
    } else {
        modelGot = args.data.attributes;
    }
    modelGot.formattedAddress = modelGot.address.formatted;
    modelGot.telefono = modelGot.contacts.tel[0];
    modelGot.fax = modelGot.contacts.fax[0];
    modelGot.web = modelGot.contacts.web[0];
    modelGot.servizi = utility.formattaServizi(modelGot.services);
    modelGot.orari = utility.formattaOrari(modelGot.schedule.timetable);
    $.detailModel.set(modelGot);
}


function toggleDettaglioServizi(e) {

    e.cancelBubble = true;
    if ($.dettaglioServizi.visible == true) {
        $.dettaglioServizi.visible = false;
        $.serviziIcon.image = "/x_abaco_blu.png";
        $.serviziText.color = Alloy.Globals.palette.blu;
        $.rowServizi.backgroundColor = "#fff";
        $.dettaglioServizi.height = 0;

    } else {
        $.dettaglioServizi.height = Ti.UI.SIZE;
        $.serviziIcon.image = "/x_abaco_bianco.png";
        $.serviziText.color = "#fff";
        $.rowServizi.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioServizi.visible = true;

    }

};

function toggleDettaglioOrari(e) {

    e.cancelBubble = true;

    if ($.dettaglioOrari.visible == true) {
        $.dettaglioOrari.visible = false;
        $.orariIcon.image = "/x_orario_blu.png";
        $.orariText.color = Alloy.Globals.palette.blu;
        $.rowOrari.backgroundColor = "#fff";
        $.dettaglioOrari.height = 0;

    } else {
        $.dettaglioOrari.height = 80;
        $.orariIcon.image = "/x_orario_bianco.png";
        $.orariText.color = "#fff";
        $.rowOrari.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioOrari.visible = true;

    }

};


$.win.addEventListener('close', function() {
    $.destroy();
});