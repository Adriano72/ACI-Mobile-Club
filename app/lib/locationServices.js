exports.getUserLocation = function(_callback) {

    if (!Alloy.Globals.DevMode) {

        if (Ti.Geolocation.locationServicesEnabled) {
            Ti.Geolocation.purpose = 'Fornire informazioni rilevanti alla posizione dell\'utente';
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
            Ti.Geolocation.distanceFilter = 10;
            Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

            Titanium.Geolocation.getCurrentPosition(function(e) {
                if (e.error) {
                    Alloy.Globals.loading.hide();
                    alert("Servizi di localizzazione non abilitati sul dispositivo");
                } else {

                    var position = {
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude
                    };

                    Ti.API.info("COORDINATE UTENTE: " + JSON.stringify(position));
                    Alloy.Globals.userPosition = position;

                    _callback(position);

                }
            });

        } else {
            Alloy.Globals.loading.hide();
            alert('Abilitare i servizi di localizzazione per usufruire del servizio');
        }

    } else {
        var position = {
            latitude: 41.8089777,
            longitude: 12.4365196
        };
        Ti.API.info("COORDINATE UTENTE: " + JSON.stringify(position));
        Alloy.Globals.userPosition = position;

        _callback(position);
    }

    /*
	 var position = {
	 latitude : 41.8089777,
	 longitude : 12.4365196
	 };
	 */

    /*
	 var position = {
	 latitude : 41.8,
	 longitude : 16.51
	 };

	 */

    /*
	 Ti.API.info("COORDINATE UTENTE: " + JSON.stringify(position));
	 Alloy.Globals.userPosition = position;

	 _callback(position);
	 */

};


/**
 * Funzione di reverse geocoding
 * @param  {number} lat       latitudine
 * @param  {number} lon       longitudine
 * @param  {Function} _callback callback nella form (err, places), dove places è l'array delle località trovate
 * @return {[type]}           [description]
 */
exports.getAddress = function(lat, lon, _callback) {
    Ti.Geolocation.reverseGeocoder(lat, lon, function(evt) {
        console.log('getAddress', evt);

        if (_callback) {

            if (evt.code == 0) { //success
                _callback(null, evt.places);
            } else {
                _callback(error);
            }
        }

    });
};