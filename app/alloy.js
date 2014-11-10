// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.deviceWidth = parseInt(Ti.Platform.displayCaps.platformWidth / (Ti.Platform.displayCaps.logicalDensityFactor || 1), 10);
Alloy.Globals.deviceWidthHalf = Alloy.Globals.deviceWidth / 2;
Alloy.Globals.deviceHeight = parseInt(Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.logicalDensityFactor || 1), 10);
Alloy.Globals.deviceHeightHalf = Alloy.Globals.deviceHeight / 2;

Alloy.Globals.menuButtonsWidth = Alloy.Globals.deviceWidthHalf - 5;
Alloy.Globals.menuButtonsHeight = (OS_ANDROID) ? (Alloy.Globals.deviceHeight / 4) - 22 : (Alloy.Globals.deviceHeight / 4) - 20;
Alloy.Globals.baseURL = "http://10.64.4.199:9900";



	require('locationServices').getUserLocation(loadData);





Alloy.Collections.automobileClub = Alloy.createCollection("automobileClub");

Alloy.Collections.automobileClub.deleteAll();


function loadData() {

	require("network").getPuntiAci("aacc", function(p_data) {

		Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));

		_.each(p_data, function(value) {

			var automobileClub = Alloy.createModel('automobileClub', {
				name : value.name,
				indirizzo : value.address.street,
				cap : value.address.postalCode,
				citta : value.address.locality.longName,
				latitudine : value.address.location[1],
				longitudine : value.address.location[0],
				telefono : JSON.stringify(value.contacts.tel),
				fax : JSON.stringify(value.contacts.fax),
				sito_web : JSON.stringify(value.contacts.web),
				email : JSON.stringify(value.contacts.email)
			});
			// Since set or save(attribute) is not being called, we can call isValid to validate the model object
			automobileClub.save();

		});
		
		Alloy.Collections.automobileClub.fetch();
		Ti.API.info("COLLECTION LENGTH: "+Alloy.Collections.automobileClub.length);

	});
}
