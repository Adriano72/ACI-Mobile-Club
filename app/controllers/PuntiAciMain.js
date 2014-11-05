var args = arguments[0] || {};

var ViewScrollr = require("ViewScrollr");
if (OS_ANDROID)
	var abx = require('com.alcoapps.actionbarextras');

function doopen(evt) {
	if (OS_ANDROID) {
		abx.displayHomeAsUp = true;
		abx.title = "Punti di servizio ACI";
		abx.titleFont = "ACI Type Regular.otf";
		abx.titleColor = "#4A678C";

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	//updateScreen();
}

var rows = [];

var itemsObj = [{
	img : "Punti di servizio ACI",
	text : "Punti di servizio ACI"

}, {
	img : "Punti di servizio ACI",
	text : "Vantaggi per i soci"

}, {
	img : "Punti di servizio ACI",
	text : "Mobilita"

}, {
	img : "Punti di servizio ACI",
	text : "La tua tessera"

}, {
	img : "Punti di servizio ACI",
	text : "Diventa socio ACI"

}, {
	img : "Punti di servizio ACI",
	text : "Guidare"

}, {
	img : "Punti di servizio ACI",
	text : "Sport"

}, {
	img : "Punti di servizio ACI",
	text : "Servizi online"

}];

var riga = Alloy.createController('TableViewRow_Single', {

	immagine : args.description,
	testo : "ciao"

}).getView();
rows.push(riga);
