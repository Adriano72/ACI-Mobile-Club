var args = arguments[0] || {};

var tmpCollection = Alloy.Collections.tempCollection;

tmpCollection.reset(args.collection);

Ti.API.info("TITOLO: " + args.titolo);

//var p_collection = Alloy.createCollection("p_collection", Alloy.Collections.dormireMangiare);

//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function loadData() {
	//Alloy.Collections.automobileClub.fetch();
	if (OS_ANDROID) {
		//abx.homeAsUpIcon = "/ico_dormiremangiare_blu.png";
		abx.displayHomeAsUp = true;
		abx.title = args.titolo;
		abx.titleFont = "ACI Type Regular.otf";
		abx.titleColor = "#003772";

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		$.titleControl.backgroundImage = args.titolo;
	}

	$.map.region = {
		latitude : Alloy.Globals.userPosition.latitude,
		latitudeDelta : 0.25,
		longitude : Alloy.Globals.userPosition.longitude,
		longitudeDelta : 0.25
	};
	//updateUI();

}

function dataTransform(model) {
	var attrs = model.toJSON();
	//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
	attrs.indirizzo = attrs.address.street;
	attrs.indirizzo2 = attrs.address.postalCode + " " + attrs.address.locality.longName;
	attrs.latitude = attrs.address.location[1];
	attrs.longitude = attrs.address.location[0];
	attrs.tel = attrs.contacts.tel[0];
	attrs.image = (OS_ANDROID) ? args.pin : "images/" + args.pin;
	attrs.title = attrs.name;
	attrs.subtitle = "Tocca per ulteriori informazioni";
	attrs.leftButton = "annotation-info.png";
	attrs.email = attrs.contacts.email[0];
	//attrs.immagine = encodeURI("http://www.aci.it/fileadmin/syc/logo/"+attrs.agreement_id.logo);

	return attrs;
};

function linkToPOI(e) {

	var clicksource = e.clicksource;

	var annotation = e.source;
	//get the Myid from annotation
	var clicksource = e.clicksource;

	if (clicksource == 'annotation' || clicksource == 'leftButton' || clicksource == 'leftPane' || clicksource == 'infoWindow' || clicksource == 'subtitle') {//leftButton event
		//alert("leftButton of " + annotation + " has been clicked.");

		var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
			data : e,
			headerImg : "logoNoleggiTrasporti.png"
		}).getView();
		Alloy.Globals.navMenu.openWindow(dettConvenzione);

	}

	Ti.API.info("CLICK: " + JSON.stringify(e));
};

function openNavigation(e) {

	require('locationServices').getUserLocation(function(userLoc) {
		var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
		Ti.API.info("NAVIGATION DATA: " + e.source.lat + " " + e.source.lon + " " + userLoc.latitude + " " + userLoc.longitude);
		Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + e.source.lat + ',' + e.source.lon);
	});

};

//tempCollection.trigger("change");

$.win.addEventListener('close', function() {
	$.destroy();
});

