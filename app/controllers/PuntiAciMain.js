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

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	//updateScreen();
}

function homeIconSelected() {
	$.win.close({
		animate : true
	});
}


var rowData = require('tabulatedData').puntiAciMain();

var rows = [];

_.each(rowData, function(value) {
	Ti.API.info("DATA: " + value.img);
	var riga = Alloy.createController('TableViewRow_Single', {

		immagine : value.img,
		testo : value.text

	}).getView();
	rows.push(riga);
});

$.puntiAciMain_Table.setData(rows);



