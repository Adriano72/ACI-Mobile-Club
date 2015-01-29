var args = arguments[0] || {};

var sideMenu = require('mapSideMenu');

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
		abx.titleColor = Alloy.Globals.palette.blu;

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
	attrs.leftButton = "/images/annotation-info.png";
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
		Ti.API.info("TYPE: " + e.annotation._type);

		if (_.isUndefined(e.annotation.agreement_id)) {

			switch(e.annotation._type) {

			case "aacc":
				var winAC = Alloy.createController('PuntiAci_AC').getView();
				Alloy.Globals.navMenu.openWindow(winAC);
				break;
			case "del":
				var dettPuntoACI = Alloy.createController('PuntiAci_DEL_Dett_Lite', {
					data : e.annotation,
					fromMap: true
				}).getView();
				Alloy.Globals.navMenu.openWindow(dettPuntoACI);
				break;
			case "pra":
				var dettPuntoACI = Alloy.createController('PuntiAci_PRA_Dett', {
					data : e.annotation,
					fromMap: true
				}).getView();
				Alloy.Globals.navMenu.openWindow(dettPuntoACI);
				break;
			case "urp":
				var dettPuntoACI = Alloy.createController('PuntiAci_URP_Dett', {
					data : e.annotation,
					fromMap: true
				}).getView();
				Alloy.Globals.navMenu.openWindow(dettPuntoACI);
				break;
			case "tasse":
				var dettPuntoACI = Alloy.createController('PuntiAci_TASSE_Dett', {
					data : e.annotation,
					fromMap: true
				}).getView();
				Alloy.Globals.navMenu.openWindow(dettPuntoACI);
				break;
			case "dem":
				var dettPuntoACI = Alloy.createController('PuntiAci_Demolitori_Dett', {
					data : e.annotation,
					fromMap: true
				}).getView();
				Alloy.Globals.navMenu.openWindow(dettPuntoACI);
				break;
			default:

			}

		} else {
			var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
				data : e,
				headerImg : ""
			}).getView();
			Alloy.Globals.navMenu.openWindow(dettConvenzione);
		}

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

var rightSettingsMenu = sideMenu.openMapSideMenu(function() {
	//Ti.API.info("BEFORE CALLBACK - COLLECTION LENGTH: " + Alloy.Collections.puntiMappa.length);
	//tmpCollection.reset();
	//tmpCollection.trigger('change');
	//$.map.removeAllAnnotations();
	//_.each($.map.annotations, function(value) {
		//$.map.removeAnnotation(value);
	//});

	//Ti.API.info("ANNOTATIONS LENGTH: " + $.map.annotations.length);
	//Alloy.Collections.puntiMappa.reset(Alloy.Collections.automobileClub.toJSON());
	//Ti.API.info("ANNOTATIONS LENGTH: " + $.map.annotations.length);

	//updateUI();
	//Ti.API.info("AFTER CALLBACK - COLLECTION LENGTH: " + Alloy.Collections.puntiMappa.length);
});

$.win.add(rightSettingsMenu);

function toggleSideMenu() {

	sideMenu.toggleMenu(rightSettingsMenu);
}

//tempCollection.trigger("change");

$.win.addEventListener('close', function() {
	$.destroy();
});

