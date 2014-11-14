var args = arguments[0] || {};

var tmpCollection = Alloy.Collections.tempCollection;

tmpCollection.reset(args.collection);

//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(tmpCollection));


//var p_collection = Alloy.createCollection("p_collection", Alloy.Collections.dormireMangiare);



//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function loadData() {
	//Alloy.Collections.automobileClub.fetch();
	if (OS_ANDROID) {
		abx.displayHomeAsUp = true;
		abx.title = "Dormire&Mangiare";
		abx.titleFont = "ACI Type Regular.otf";
		abx.titleColor = "#003772";

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	
	$.map.region = { latitude: Alloy.Globals.userPosition.latitude, latitudeDelta: 0.25, longitude: Alloy.Globals.userPosition.longitude, longitudeDelta: 0.25 };
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
	attrs.image = args.pin;
	attrs.title = attrs.name;
	attrs.email = attrs.contacts.email[0];
	//attrs.immagine = encodeURI("http://www.aci.it/fileadmin/syc/logo/"+attrs.agreement_id.logo);
	
	return attrs;
};

function openNavigation(e) {

	require('locationServices').getUserLocation(function(userLoc) {
		var mapsServiceURL = (OS_ANDROID)?'http://maps.google.com/maps?t=m&saddr=':'http://maps.apple.com/maps?t=m&saddr=';
		Ti.API.info("NAVIGATION DATA: " + e.source.lat+" "+e.source.lon+" "+userLoc.latitude+" "+userLoc.longitude);
		Ti.Platform.openURL(mapsServiceURL+userLoc.latitude+','+userLoc.longitude + '&daddr=' +e.source.lat+','+e.source.lon);
	});

};

//tempCollection.trigger("change");

$.win.addEventListener('close', function() {
	$.destroy();
});

