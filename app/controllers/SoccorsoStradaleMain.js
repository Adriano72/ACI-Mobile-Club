var args = arguments[0] || {};
var commons = require('commons');
var locationServices = require('locationServices');

var AciGlobal = require('aciglobal');


var headerText = "Assistenza";
var headerImg = "/images/ic_action_home_assistenza_blu.png";

//inizializzazioni comuni della Window
commons.initWindow($.win, headerText, headerImg);

/*
var rowData = [{
    //richiesta
    immagine: "/images/ic_action_aiuto_gps_rosso.png",
    testo: "Invia la tua posizione per essere richiamato",
    id_code: 'richiedi'

}, {
    //chiama numero verde
    immagine: "/images/ic_action_aiuto_phone_rosso.png",
    testo: "Chiama l'" + AciGlobal.NumeroVerde,
    id_code: 'chiama'

}];

var rows = [];

_.each(rowData, function(value) {
    //Ti.API.info("DATA: " + value.img);
    var riga = Alloy.createController('TableViewRow_Single', value);
    //con questo hack non ho bisogno di creare un nuovo controllo
    riga.rowText.color = Alloy.Globals.palette.rosso;
    rows.push(riga.getView());
});

*/

function selectionDetail(e) {
    console.log('selection', e);
    if (!_.isUndefined(e.row)) {

        Ti.API.info("CLICKED DATA: " + e.row.id_code);
        var win_controller;

        switch (e.row.id_code) {

            case "richiedi":
                win_controller = "SoccorsoStradale_Richiesta";
                break;
            case "chiama":
                win_controller = "SoccorsoStradale_Chiama";
                break;


            default:

        }

        if (win_controller) {
            var winAC = Alloy.createController(win_controller).getView();
            Alloy.Globals.navMenu.openWindow(winAC);
        }
    }
};



function toggleDettaglioChiama(e) {

    e.cancelBubble = true;
    console.log('$.dettaglioChiama.visible == true', $.dettaglioChiama.visible);

    if ($.dettaglioChiama.visible) {

        $.dettaglioChiama.visible = false;
        $.chiamaIcon.image = "/images/ic_action_aiuto_phone_rosso.png"
        $.chiamaText.color = Alloy.Globals.palette.rosso;
        $.rowChiama.backgroundColor = "#fff";
        $.dettaglioChiama.height = 0;

    } else {

        $.dettaglioChiama.height = Ti.UI.SIZE;
        $.chiamaIcon.image = "/images/ic_action_aiuto_phone_bianco.png"
        $.chiamaText.color = "#fff";
        $.rowChiama.backgroundColor = Alloy.Globals.palette.rosso;
        $.dettaglioChiama.visible = true;

    }



};

function toggleDettaglioRichiesta(e) {

    e.cancelBubble = true;
    console.log('$.dettaglioRichiesta.visible == true', $.dettaglioRichiesta.visible);
    if ($.dettaglioRichiesta.visible) {

        $.dettaglioRichiesta.visible = false;
        $.richiestaIcon.image = "/images/ic_action_aiuto_gps_rosso.png";
        $.richiestaText.color = Alloy.Globals.palette.rosso;
        $.rowRichiesta.backgroundColor = Alloy.Globals.palette.bianco;
        $.dettaglioRichiesta.height = 0;

    } else {

        $.dettaglioRichiesta.height = Ti.UI.FILL;
        $.richiestaIcon.image = "/images/ic_action_aiuto_gps_bianco.png";
        $.richiestaText.color = Alloy.Globals.palette.bianco;
        $.rowRichiesta.backgroundColor = Alloy.Globals.palette.rosso;
        $.dettaglioRichiesta.visible = true;

    }



};

function fill() {
    var tot = Alloy.Globals.deviceHeight * 0.8;
    tot -= $.rowRichiesta.rect.height;
    tot -= $.dettaglioRichiesta.rect.height;
    tot -= $.rowChiama.rect.height;
    tot -= $.dettaglioChiama.rect.height;
    console.log('fill', $.main.rect.height, tot);
    $.filler.height = tot;
}

$.richiestaController.getView().height = Ti.UI.SIZE;
$.chiamaController.getView().height = Ti.UI.SIZE;
toggleDettaglioRichiesta({});
toggleDettaglioChiama({});
/*
function displayConvenzioneBanner() {

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: Alloy.Globals.convenzioneBanner,
        headerImg: "",
        isBanner: true
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);

}
*/


function onLocation(e) {
    console.log('onLocation', e);
    $.richiestaController.updatePosition();
}

/**
 * hadler dell'evento Window.open
 * @return {[type]} [description]
 */
function open() {
    locationServices.getUserLocation(function() {
        Ti.Geolocation.addEventListener('location', onLocation);
    });
}

/**
 * hadler dell'evento Window.close
 * @return {[type]} [description]
 */
function close() {
    Ti.Geolocation.removeEventListener('location', onLocation);
    $.destroy();
}