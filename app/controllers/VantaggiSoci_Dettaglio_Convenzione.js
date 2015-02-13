var args = arguments[0] || {};

Ti.API.info("MODELLO: " + JSON.stringify(args));

var encoder = require('encoder');

if (args.isBanner) {

	var modelGot = args.data;

} else if (_.isUndefined(args.data.annotation)) {

	var modelGot = args.data.attributes;

} else {

	var modelGot = args.data.annotation;

}
;

Ti.API.info("DATI: " + JSON.stringify(modelGot));

modelGot.formattedAddress = modelGot.address.formatted;
modelGot.telefono = modelGot.contacts.tel[0];
modelGot.fax = modelGot.contacts.fax[0];
modelGot.web = modelGot.contacts.web[0];
modelGot.descrizione = encoder.Encoder.htmlDecode(modelGot.agreement_id.serviceTypeDesc).trim();
modelGot.come = encoder.Encoder.htmlDecode(modelGot.agreement_id.offerDesc).trim();
console.log("come", modelGot.come);
modelGot.vantaggio = encoder.Encoder.htmlDecode(modelGot.agreement_id.discountDesc).trim();
modelGot.logo = encodeURI("http://www.aci.it/fileadmin/syc/logo/" + modelGot.agreement_id.images.logo);

$.dormireMangiare.set(modelGot);

if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {
	if (OS_ANDROID) {

		init1();

	} else {
		$.titleControl.backgroundImage = args.headerImg;

	}

	//updateScreen();
}

function init1() {
	abx.displayHomeAsUp = true;
	abx.title = "Dettaglio Convenzione";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = Alloy.Globals.palette.blu;
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}

function toggleDettaglioDescrizione(e) {

	e.cancelBubble = true;

	if ($.dettaglioDescrizione.visible == true) {

		$.dettaglioDescrizione.visible = false;
		$.descrizioneIcon.image = "/x_descrizione_blu.png";
		$.descrizioneText.color = Alloy.Globals.palette.blu;
		$.rowDescrizione.backgroundColor = "#fff";
		$.dettaglioDescrizione.height = 0;

	} else {

		$.dettaglioDescrizione.height = Ti.UI.SIZE;
		$.descrizioneIcon.image = "/x_descrizione_bianco.png";
		$.descrizioneText.color = "#fff";
		$.rowDescrizione.backgroundColor = Alloy.Globals.palette.blu;
		$.dettaglioDescrizione.visible = true;

	}

};



function toggleDettaglioVantaggio(e) {

	e.cancelBubble = true;

	if ($.dettaglioVantaggio.visible == true) {
		$.dettaglioVantaggio.visible = false;
		$.vantaggioIcon.image = "/x_vantaggi_blu.png";
		$.vantaggioText.color = Alloy.Globals.palette.blu;
		$.rowVantaggio.backgroundColor = "#fff";
		$.dettaglioVantaggio.height = 0;

	} else {
		$.dettaglioVantaggio.height = Ti.UI.SIZE;
		$.vantaggioIcon.image = "/x_vantaggi_bianco.png";
		$.vantaggioText.color = "#fff";
		$.rowVantaggio.backgroundColor = Alloy.Globals.palette.blu;
		$.dettaglioVantaggio.visible = true;

	}

};

function toggleDettaglioComeVantaggio(e) {

	e.cancelBubble = true;

	if ($.dettaglioComeVantaggio.visible == true) {
		$.dettaglioComeVantaggio.visible = false;
		$.comeVantaggioIcon.image = "/images/ic_action_come_ottenere_vantaggi_blu.png";
		$.comeVantaggioText.color = Alloy.Globals.palette.blu;
		$.rowComeVantaggio.backgroundColor = "#fff";
		$.dettaglioComeVantaggio.height = 0;

	} else {
		$.dettaglioComeVantaggio.height = Ti.UI.SIZE;
		$.comeVantaggioIcon.image = "/images/ic_action_come_ottenere_vantaggi_bianco.png";
		$.comeVantaggioText.color = "#fff";
		$.rowComeVantaggio.backgroundColor = Alloy.Globals.palette.blu;
		$.dettaglioComeVantaggio.visible = true;

	}

};

function openNavigation(e) {

	require('locationServices').getUserLocation(function(userLoc) {
		var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
		Ti.API.info("NAVIGATION DATA: " + modelGot.address.location[1] + " " + modelGot.address.location[0] + " " + userLoc.latitude + " " + userLoc.longitude);
		Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + modelGot.address.location[1] + ',' + modelGot.address.location[0]);
	});

};

function doPhoneCall(e) {
	e.cancelBubble = true;

	if (modelGot.contacts.tel[0]) {
		var trimmedPhone = modelGot.contacts.tel[0].replace(/\s+/g, '');
		Ti.API.info("TEL: " + trimmedPhone);
		Titanium.Platform.openURL('tel:' + trimmedPhone);
	} else {
		alert("Numero di telefono non disponibile");
	}

};

function doSendEmail(e) {
	e.cancelBubble = true;

	if (modelGot.contacts.email[0] !== "") {
		Ti.API.info("EMAIL: " + modelGot.contacts.email[0]);
		var recipients = [];
		recipients.push(modelGot.contacts.email[0]);
		var emailDialog = Ti.UI.createEmailDialog();
		emailDialog.toRecipients = recipients;
		emailDialog.open();
	} else {
		alert("Indirizzo email non disponibile");
	}

};
