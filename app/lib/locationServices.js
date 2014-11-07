exports.getUserLocation = function() {

	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.purpose = 'Fornire informazioni rilevanti alla posizione dell\'utente';
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		
		

		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				alert('Error: ' + e.error);
			} else {
				
				alert("COORDINATE UTENTE: " + JSON.stringify({
					latitude : e.coords.longitude,
					longitude : e.coords.latitude
				}));
				
				return {
					latitude : e.coords.longitude,
					longitude : e.coords.latitude
				};
				
			}
		});
	} else {
		alert('Abilitare i servizi di localizzazione per usufruire del servizio');
	}

};
