var args = arguments[0] || {};


var headerText = "Vantaggi per i soci";
var headerImg = "/images/ic_action_home_vantaggi_soci_blu.png";


//inizializzazioni comuni della Window
require('commons').initWindow($.win, headerText, headerImg);



$.banner.start();

var rowData = require('tabulatedData').categorieSyc();

var rows = [];

_.each(rowData, function(value) {
    //Ti.API.info("DATA: " + value.img);
    var riga = Alloy.createController('TableViewRow_Single', {

        immagine: value.img,
        testo: value.long_name,
        id_code: value.short_name

    }).getView();
    rows.push(riga);
});

function selectionDetail(e) {

    if (!_.isUndefined(e.row)) {

        Ti.API.info("CLICKED DATA: " + e.row.id_code);


        var winAC = Alloy.createController('VantaggiSoci_List', {

            icon: e.row.img,
            title: e.row.testo,
            id_code: e.row.id_code

        }).getView();
        Alloy.Globals.navMenu.openWindow(winAC);
        /*
		switch(e.row.id_code) {

		case "dormire_mangiare":
			var winAC = Alloy.createController('VantaggiSoci_DormMang').getView();
			Alloy.Globals.navMenu.openWindow(winAC);
			break;
		case "tempo_libero_benessere":
			var winAC = Alloy.createController('VantaggiSoci_TempoLibero').getView();
			Alloy.Globals.navMenu.openWindow(winAC);
			break;
		case "cultura_spettacoli":
			var winAC = Alloy.createController('VantaggiSoci_CulturaSpettacoli').getView();
			Alloy.Globals.navMenu.openWindow(winAC);
			break;
		case "noleggi_trasporti":
			var winAC = Alloy.createController('VantaggiSoci_NoleggiTrasporti').getView();
			Alloy.Globals.navMenu.openWindow(winAC);
			break;
		case "sport_eventi":
			var winAC = Alloy.createController('VantaggiSoci_SportEventi').getView();
			Alloy.Globals.navMenu.openWindow(winAC);
			break;
		case "altri_servizi":
			var winAC = Alloy.createController('VantaggiSoci_AltriServizi').getView();
			Alloy.Globals.navMenu.openWindow(winAC);
			break;

		default:

		}
		*/
    }
};

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


$.puntiAciMain_Table.setData(rows);