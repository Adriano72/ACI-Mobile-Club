var args = arguments[0] || {};
var commons = require('commons');

var AciGlobal = require('aciglobal');


var headerText = "Assistenza";
var headerImg = "/images/ic_action_home_assistenza_blu.png";

//inizializzazioni comuni della Window
commons.initWindow($.win, headerText, headerImg);


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


$.puntiAciMain_Table.setData(rows);