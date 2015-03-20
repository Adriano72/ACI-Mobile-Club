/**
 * Modulo che gestisce le funzionalità per la posizione dell'utente
 * Docs: https://wiki.appcelerator.org/display/guides2/Tracking+Position+and+Heading
 */


/**
 * Numero di tentativi di recuperare la posizione attuale, in caso di fallimento
 * @type {Number}
 */
var MAX_TRIES = 3;
/**
 * Millisecondi tra un tentativo e un altro
 * @type {Number}
 */
var TRIES_DELAY = 100;


exports.init = function() {
    /* var locationAdded = false;
    var handleLocation = function(e) {
        if (!e.error) {
            console.log(e.coords);
        }
    };
    var addHandler = function() {
        console.log('add handler');

        if (!locationAdded) {
            Ti.Geolocation.addEventListener('location', handleLocation);
            locationAdded = true;
        }
    };
    var removeHandler = function() {
        alert('remove');
        console.log('remove handler');
        if (locationAdded) {
            Ti.Geolocation.removeEventListener('location', handleLocation);
            locationAdded = false;
        }
    };

    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    if (Ti.Geolocation.locationServicesEnabled) {
        addHandler();

        if (OS_ANDROID) {
            var activity = Ti.Android.currentActivity;
            activity.addEventListener('destroy', removeHandler);
            activity.addEventListener('pause', removeHandler);
            activity.addEventListener('resume', addHandler);
        }
    } else {
        alert('Please enable location services');
    } */

    exports.getUserLocation(function(err, p) {
        //position salvata
        console.log('position salvata', p);
    });

};






exports.getUserLocation = function(_callback) {

    var fake = Alloy.Globals.DevMode;
    console.log('fake', fake);
    if (!fake) {

        if (Ti.Geolocation.locationServicesEnabled) {

            Ti.Geolocation.purpose = 'Fornire informazioni rilevanti alla posizione dell\'utente';
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
            Ti.Geolocation.distanceFilter = 10;
            Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

            var tries = 0;

            /**
             * callback di risposta alla richiesta di posizione
             * @param  {[type]} e [description]
             */
            var onPosition = function(e) {
                if (e.error) {
                    console.log('getCurrentPosition  error', e);

                    if (tries < MAX_TRIES) {
                        //ritento
                        tries++;
                        setTimeout(getCurrentPosition, TRIES_DELAY);
                    } else {
                        //genero l'errore
                        Alloy.Globals.loading.hide();

                        _callback(e);
                    }
                } else {

                    var position = {
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude
                    };

                    Ti.API.info("COORDINATE UTENTE: " + JSON.stringify(position));
                    Alloy.Globals.userPosition = position;

                    _callback(null, position);

                }
            };

            var getCurrentPosition = function() {
                Titanium.Geolocation.getCurrentPosition(onPosition);
            };


            getCurrentPosition();

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

        _callback(null, position);
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
 * ritorna l'ultima posizione conosciuta dell'utente
 * @return {[type]} [description]
 */
exports.getLastLocation = function() {
    return Alloy.Globals.userPosition;
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