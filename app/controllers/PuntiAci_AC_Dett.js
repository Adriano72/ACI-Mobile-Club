var args = arguments[0] || {};

if(args.fromMap){
	var modelGot = args.data;
}else{
	var modelGot = args.data.attributes;
}


modelGot.formattedAddress = modelGot.address.formatted;
modelGot.telefono = modelGot.contacts.tel[0];
modelGot.fax = modelGot.contacts.fax[0];
modelGot.web = modelGot.contacts.web[0];
modelGot.servizi = modelGot.services.toString();
modelGot.orari = modelGot.schedule.timetable.toString();

$.pra.set(modelGot);

Ti.API.info("MODELLO: " + JSON.stringify(args.data.attributes));

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
	abx.title = "Automobile Club";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = Alloy.Globals.palette.blu;
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}

function toggleDettaglioServizi(e) {
	
	e.cancelBubble = true;
	if ($.dettaglioServizi.visible == true) {
		$.dettaglioServizi.visible = false;
		$.serviziIcon.image = "/x_abaco_blu.png";
		$.serviziText.color = Alloy.Globals.palette.blu;
		$.rowServizi.backgroundColor = "#fff";
		$.dettaglioServizi.height = 0;

	} else {
		$.dettaglioServizi.height = 80;
		$.serviziIcon.image = "/x_abaco_bianco.png";
		$.serviziText.color = "#fff";
		$.rowServizi.backgroundColor = Alloy.Globals.palette.blu;
		$.dettaglioServizi.visible = true;

	}

};

function toggleDettaglioOrari(e) {
	
	e.cancelBubble = true;
	
	if ($.dettaglioOrari.visible == true) {
		$.dettaglioOrari.visible = false;
		$.orariIcon.image = "/x_orario_blu.png";
		$.orariText.color = Alloy.Globals.palette.blu;
		$.rowOrari.backgroundColor = "#fff";
		$.dettaglioOrari.height = 0;

	} else {
		$.dettaglioOrari.height = 80;
		$.orariIcon.image = "/x_orario_bianco.png";
		$.orariText.color = "#fff";
		$.rowOrari.backgroundColor = Alloy.Globals.palette.blu;
		$.dettaglioOrari.visible = true;

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

 $.win.addEventListener('close', function() {
	$.destroy();
});
