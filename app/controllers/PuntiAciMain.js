var args = arguments[0] || {};

if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {
	if (OS_ANDROID) {
		abx.displayHomeAsUp = true;
		abx.title = "Punti di servizio ACI";
		abx.titleFont = "ACI Type Regular.otf";
		abx.titleColor = "#003772";

		//actionBarHelper.setIu k098  -m,.ooooocon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	//updateScreen();
}

var rowData = require('tabulatedData').puntiAciMain();

var rows = [];

_.each(rowData, function(value) {
	Ti.API.info("DATA: " + value.img);
	var riga = Alloy.createController('TableViewRow_Single', {

		immagine : value.img,
		testo : value.text,
		id_code : value.id_code

	}).getView();
	rows.push(riga);
});

function selectionDetail(e) {
	Ti.API.info("CLICKED DATA: " + e.row.id_code);
	
	switch(e.row.id_code) {
		
	case "AC":
		var winAC = Alloy.createController('PuntiAci_AC').getView();
		Alloy.Globals.navMenu.openWindow(winAC);
	default:
		
	}
};

$.puntiAciMain_Table.setData(rows);
