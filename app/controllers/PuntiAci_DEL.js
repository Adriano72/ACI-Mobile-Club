var args = arguments[0] || {};

//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function loadData() {
	//Alloy.Collections.automobileClub.fetch();
	if (OS_ANDROID) {

		init1();

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	updateUI();
	$.searchBar.blur();

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

function dataTransform(model) {
	var attrs = model.toJSON();
	//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
	attrs.indirizzo = attrs.address.street;
	attrs.indirizzo2 = attrs.address.postalCode + " " + attrs.address.locality.longName;
	attrs.latitude = attrs.address.location[1];
	attrs.longitude = attrs.address.location[0];
	attrs.tel = attrs.contacts.tel[0];
	attrs.email = attrs.contacts.email[0];
	attrs.id = model.cid;

	//Ti.API.info("MODEL CID: "+attrs.id);
	return attrs;
};

function openNavigation(e) {

	require('locationServices').getUserLocation(function(userLoc) {
		var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
		Ti.API.info("NAVIGATION DATA: " + e.source.lat + " " + e.source.lon + " " + userLoc.latitude + " " + userLoc.longitude);
		Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + e.source.lat + ',' + e.source.lon);
	});

}

function mostraMappa() {

	var mapWin = Alloy.createController('mapView', {
		collection : Alloy.Collections.delegazioni.toJSON(),
		pin : "pin_Delegazioni.png",
		titolo : (OS_ANDROID) ? "Delegazioni" : $.titleControl.backgroundImage,
		homeIcon : "ico_delegazioni_blu.png"
	}).getView();
	Alloy.Globals.navMenu.openWindow(mapWin);
};

function dettaglioDelegazione(e) {
	var selectedDel = Alloy.Collections.delegazioni.getByCid(e.rowData.modelId);

	var dettDelegazione = Alloy.createController('PuntiAci_DEL_Dett_Lite', {data: selectedDel}).getView();
	Alloy.Globals.navMenu.openWindow(dettDelegazione);
}

function doPhoneCall(e) {
	e.cancelBubble = true;
	Titanium.Platform.openURL(e.source.telNumber);
};

function doSendEmail(e) {
	e.cancelBubble = true;
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.toRecipients = (e.source.email != "") ? e.source.email : "test@email.com";
	emailDialog.open();
};

$.win.addEventListener('close', function() {
	$.destroy();
});

