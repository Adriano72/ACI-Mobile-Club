var args = arguments[0] || {};

var headerText = "Punti di servizio ACI";
var headerImg = "/images/ic_action_puntatore.png";

//inizializzazioni comuni della Window
require('commons').initWindow($.win, headerText, headerImg);



$.banner.start();


//popolo la tabella dei serivizi
var rowData = require('tabulatedData').puntiAciMain();
var rows = [];
_.each(rowData, function(value) {
    //Ti.API.info("DATA: " + value.img);
    var riga = Alloy.createController('TableViewRow_Single', {

        immagine: value.img,
        testo: value.text,
        id_code: value.id_code

    }).getView();
    rows.push(riga);
});
$.puntiAciMain_Table.setData(rows);

if (OS_ANDROID) {
    //popolo la tabella della ricerca
    var rows2 = [];
    rows2.push(Alloy.createController('TableViewRow_Single', {

        immagine: "/images/ic_action_cerca_per_servizio_blu.png",
        testo: "Ricerca per serivizio",
        id_code: "RIC"

    }).getView());
    $.ricercaServizio_Table.setData(rows2);
}

function selectionDetail(e) {

    if (!_.isUndefined(e.row)) {

        Ti.API.info("CLICKED DATA: " + e.row.id_code);

        var params = {
            icon: e.row.img,
            title: e.row.testo,
            id_code: e.row.id_code
        };

        console.log('PuntiAciMail params', params);

        var winAC = Alloy.createController('PuntiAci_List', params).getView();
        Alloy.Globals.navMenu.openWindow(winAC);
    }
};




function openRicerca() {

    var winAC = Alloy.createController('PuntiAci_RicercaServizio').getView();
    Alloy.Globals.navMenu.openWindow(winAC);

}

function displayConvenzioneBanner() {

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: Alloy.Globals.convenzioneBanner,
        headerImg: "",
        isBanner: true
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);

}

$.win.addEventListener('close', function() {
    $.banner.stop();
});