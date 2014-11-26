var args = arguments[0] || {};

var encoder = require('encoder');

var modelGot = args.data.attributes;

Ti.API.info("MODELLO: " + JSON.stringify(args.data.attributes));

modelGot.formattedAddress = modelGot.address.formatted;
modelGot.telefono = modelGot.contacts.tel[0];
modelGot.fax = modelGot.contacts.fax[0];
modelGot.web = modelGot.contacts.web[0];
modelGot.descrizione = encoder.Encoder.htmlDecode(modelGot.agreement_id.serviceTypeDesc);
modelGot.vantaggio = encoder.Encoder.htmlDecode(modelGot.agreement_id.discountDesc);
modelGot.logo = encodeURI("http://www.aci.it/fileadmin/syc/logo/" + modelGot.agreement_id.images.logo);

$.dormireMangiare.set(modelGot);

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
	abx.title = "Delegazioni";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = "#003772";
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
		$.descrizioneText.color = "#003772";
		$.rowDescrizione.backgroundColor = "#fff";
		$.dettaglioDescrizione.height = 0;

	} else {

		$.dettaglioDescrizione.height = Ti.UI.SIZE;
		$.descrizioneIcon.image = "/x_descrizione_bianco.png";
		$.descrizioneText.color = "#fff";
		$.rowDescrizione.backgroundColor = "#003772";
		$.dettaglioDescrizione.visible = true;

	}

};

function toggleDettaglioVantaggio(e) {
	
	e.cancelBubble = true;

	if ($.dettaglioVantaggio.visible == true) {
		$.dettaglioVantaggio.visible = false;
		$.vantaggioIcon.image = "/x_vantaggi_blu.png";
		$.vantaggioText.color = "#003772";
		$.rowVantaggio.backgroundColor = "#fff";
		$.dettaglioVantaggio.height = 0;

	} else {
		$.dettaglioVantaggio.height = Ti.UI.SIZE;
		$.vantaggioIcon.image = "/x_vantaggi_bianco.png";
		$.vantaggioText.color = "#fff";
		$.rowVantaggio.backgroundColor = "#003772";
		$.dettaglioVantaggio.visible = true;

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
	var trimmedPhone = (modelGot.contacts.tel[0]) ? modelGot.contacts.tel[0].replace(/\s+/g, '') : "069998383";
	Ti.API.info("TEL: " + trimmedPhone);
	Titanium.Platform.openURL('tel:' + trimmedPhone);
	//Titanium.Platform.openURL("tel:"+e.source.telNumber);
};

function doSendEmail(e) {
	e.cancelBubble = true;
	Ti.API.info("EMAIL: " + modelGot.contacts.email[0]);
	var recipients = [];
	recipients.push((modelGot.contacts.email[0] != "") ? modelGot.contacts.email[0] : "test@email.com");
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.toRecipients = recipients;
	emailDialog.open();
};
