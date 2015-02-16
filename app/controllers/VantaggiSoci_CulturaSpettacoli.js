var args = arguments[0] || {};
var utility = require('utility');

if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function openWin() {
	if (OS_ANDROID) {

		init1();

	} else {
		//$.windowtitle.text = winTitle;
	}

	updateUI();
	$.searchBar.blur();

}

function init1() {
	abx.displayHomeAsUp = true;
	abx.title = "Cultura & Spettacoli";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = Alloy.Globals.palette.blu;
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}

function dataTransform(model) {
	var attrs = model.toJSON();
	//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
	attrs.indirizzo = attrs.address.street;
	attrs.distance = utility.formatDistance(attrs.address.distance);
    var ind2 = (attrs.address.postalCode || '') + ' ' + (attrs.address.locality.longName || '');
	attrs.latitude = attrs.address.location[1];
    attrs.latitude = attrs.address.location[1];
	attrs.longitude = attrs.address.location[0];
	attrs.tel = attrs.contacts.tel[0];
	attrs.email = attrs.contacts.email[0];
	attrs.immagine = encodeURI("http://www.aci.it/fileadmin/syc/logo/" + attrs.agreement_id.images.logo);
	attrs.id = model.cid;
	return attrs;
};

function dettaglioConvenzione(e) {
	var selectedConv = Alloy.Collections.culturaSpettacoli.getByCid(e.rowData.modelId);

	var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {data: selectedConv, headerImg:"logoCulturaSpettacoli.png"}).getView();
	Alloy.Globals.navMenu.openWindow(dettConvenzione);
}


function openNavigation(e) {

	require('locationServices').getUserLocation(function(userLoc) {
		var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
		Ti.API.info("NAVIGATION DATA: " + e.source.lat + " " + e.source.lon + " " + userLoc.latitude + " " + userLoc.longitude);
		Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + e.source.lat + ',' + e.source.lon);
	});

};

function mostraMappa() {

	var mapWin = Alloy.createController('mapView', {
		collection : Alloy.Collections.culturaSpettacoli.toJSON(),
		pin : "pin_CulturaSpettacoli.png",
		titolo: (OS_ANDROID)?"Cultura & Spettacoli":$.titleControl.backgroundImage,
		homeIcon: "ico_musei_blu.png"
		
	}).getView();
	Alloy.Globals.navMenu.openWindow(mapWin);
};

function togglePreferiti(e) {

};

function openDettagli(e) {

};

$.win.addEventListener('close', function() {
	$.destroy();
});

