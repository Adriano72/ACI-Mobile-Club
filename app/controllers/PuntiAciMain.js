var args = arguments[0] || {};

if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {

    $.banner.start();

    if (OS_ANDROID) {

        init1();

    } else {
        //$.windowtitle.text = winTitle;
    }
    //updateScreen();
}

function init1() {
    abx.displayHomeAsUp = true;
    abx.title = "Punti di servizio ACI";
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = Alloy.Globals.palette.blu;
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
}


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

        switch (e.row.id_code) {

            case "AC":
                var winAC = Alloy.createController('PuntiAci_AC').getView();
                Alloy.Globals.navMenu.openWindow(winAC);
                break;
            case "DEL":
                var winAC = Alloy.createController('PuntiAci_DEL').getView();
                Alloy.Globals.navMenu.openWindow(winAC);
                break;
            case "PRA":
                var winAC = Alloy.createController('PuntiAci_PRA').getView();
                Alloy.Globals.navMenu.openWindow(winAC);
                break;
            case "URP":
                var winAC = Alloy.createController('PuntiAci_URP').getView();
                Alloy.Globals.navMenu.openWindow(winAC);
                break;
            case "TASSE":
                var winAC = Alloy.createController('PuntiAci_TASSE').getView();
                Alloy.Globals.navMenu.openWindow(winAC);
                break;
            case "DEM":
                var winAC = Alloy.createController('PuntiAci_DEMOLITORI').getView();
                Alloy.Globals.navMenu.openWindow(winAC);
                break;
            case "RIC": //ATTENZIONE: non proviene da tabulatedData.js
                var winAC = Alloy.createController('PuntiAci_RicercaServizio').getView();
                Alloy.Globals.navMenu.openWindow(winAC);
                break;
            default:

        }
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