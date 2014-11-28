var args = arguments[0] || {};

if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {
	if (OS_ANDROID) {
		abx.displayHomeAsUp = true;
		abx.title = "Vantaggi per i soci";
		abx.titleFont = "ACI Type Regular.otf";
		abx.titleColor = "#003772";

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	//updateScreen();
}

var rowData = require('tabulatedData').categorieSyc();

var rows = [];

_.each(rowData, function(value) {
	//Ti.API.info("DATA: " + value.img);
	var riga = Alloy.createController('TableViewRow_Single', {

		immagine : value.img,
		testo : value.long_name,
		id_code : value.short_name

	}).getView();
	rows.push(riga);
});

function selectionDetail(e) {
	Ti.API.info("CLICKED DATA: " + e.row.id_code);

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
		var winAC = Alloy.createController('PuntiAci_DEL').getView();
		Alloy.Globals.navMenu.openWindow(winAC);
		break;
	case "noleggi_trasporti":
		var winAC = Alloy.createController('PuntiAci_DEL').getView();
		Alloy.Globals.navMenu.openWindow(winAC);
		break;
	case "sport_eventi":
		var winAC = Alloy.createController('PuntiAci_DEL').getView();
		Alloy.Globals.navMenu.openWindow(winAC);
		break;
	case "altri_servizi":
		var winAC = Alloy.createController('PuntiAci_DEL').getView();
		Alloy.Globals.navMenu.openWindow(winAC);
		break;
		
	default:

	}
};

$.puntiAciMain_Table.setData(rows);
