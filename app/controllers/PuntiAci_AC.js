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
	abx.title = "Automobile Club";
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
	return attrs;
};

function openNavigation(e) {

	require('locationServices').getUserLocation(function(userLoc) {
		var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
		Ti.API.info("NAVIGATION DATA: " + e.source.lat + " " + e.source.lon + " " + userLoc.latitude + " " + userLoc.longitude);
		Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + e.source.lat + ',' + e.source.lon);
	});

};

function mostraMappa() {

	var mapWin = Alloy.createController('mapView', {
		collection : Alloy.Collections.automobileClub.toJSON(),
		pin : "pin_AutomobileClub.png",
		titolo: (OS_ANDROID)?"Automobile club":$.titleControl.backgroundImage,
		homeIcon: "ico_aci_blu.png"
		
	}).getView();
	Alloy.Globals.navMenu.openWindow(mapWin);
};


function doPhoneCall(e) {
	var trimmedPhone = e.source.telNumber.replace(/\s+/g, '');
	Ti.API.info("TEL: " + trimmedPhone);
	Titanium.Platform.openURL('tel:' + trimmedPhone);
	//Titanium.Platform.openURL("tel:"+e.source.telNumber);
};

function doSendEmail(e) {
	Ti.API.info("EMAIL: " + e.source.indirizzoEmail);
	var recipients = [];
	recipients.push((e.source.indirizzoEmail != "") ? e.source.indirizzoEmail : "test@email.com");
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.toRecipients = recipients;
	emailDialog.open();
};

$.win.addEventListener('close', function() {
	$.destroy();
});

