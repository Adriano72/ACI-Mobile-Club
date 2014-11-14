var args = arguments[0] || {};

if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {
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
	abx.titleColor = "#003772";
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}

var rowData = require('tabulatedData').puntiAciMain();

var rows = [];

_.each(rowData, function(value) {
	//Ti.API.info("DATA: " + value.img);
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
		break;
	case "DEL":
		var winAC = Alloy.createController('PuntiAci_DEL').getView();
		Alloy.Globals.navMenu.openWindow(winAC);
		break;
	default:

	}
};

$.puntiAciMain_Table.setData(rows);
