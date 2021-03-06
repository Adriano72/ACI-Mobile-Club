'use strict';
/**
 * Modulo che gestisce le funzionalità per la posizione dell'utente
 * Docs: https://wiki.appcelerator.org/display/guides2/Tracking+Position+and+Heading
 */


//utile in svilupo
var default_position = {
    latitude: 41.8089777,
    longitude: 12.4365196
};

/**
 * Numero di tentativi di recuperare la posizione attuale, in caso di fallimento
 * @type {Number}
 */
var MAX_TRIES = 3;
/**
 * Millisecondi tra un tentativo e un altro
 * @type {Number}
 */
var TRIES_DELAY = 500;


/**
 * Il minimo cambiamento di posizione per generare
 * @type {Number}
 */
var MIN_UPDATE_DISTANCE = 10;


var lastAddress, lastPosition;

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


    if (Ti.Geolocation.locationServicesEnabled) {

        Ti.Geolocation.purpose = 'Fornire informazioni rilevanti alla posizione dell\'utente';
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;


        Ti.Geolocation.distanceFilter = MIN_UPDATE_DISTANCE;



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

                console.log('why???', tries);
                /* var position = {
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude
                    };*/
                if (e.coords) {
                    console.log('position', e);
                    lastPosition = e.coords;

                    (function() {
                        console.log('callback');
                        _callback(null, e.coords);
                    })();
                }


            }
        };

        var getCurrentPosition = function() {
            Titanium.Geolocation.getCurrentPosition(onPosition);
        };

        if (OS_IOS) {
            Ti.Geolocation.addEventListener('authorization', onPosition);
        }

        getCurrentPosition();

    } else {
        Alloy.Globals.loading.hide();
        alert('Abilitare i servizi di localizzazione per usufruire del servizio');
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
    var l = Ti.Geolocation.lastGeolocation;
    var g;
    if (l) {
        g = JSON.parse(l);
    } else {
        g = lastPosition;
    }
    if (g && !_.isEmpty(g)) g.address = lastAddress;
    return g;
};



exports.setLastLocation = function(p) {
    //se uso la cache del modulo geolocation, non ha senso questa funzione
    // Alloy.Globals.userPosition = p;
};

/**
 *
 * @return {[type]} [description]
 */
exports.useLocation = function() {

    /*  
    console.log('Ti.Geolocation.locationServicesEnabled', Ti.Geolocation.locationServicesEnabled);
    console.log('!_.isEmpty(Alloy.Globals.userPosition', !_.isEmpty(Alloy.Globals.userPosition));
    console.log('Alloy.Globals.userPosition', Alloy.Globals.userPosition);
    console.log('Ti.Geolocation.locationServicesAuthorization', Ti.Geolocation.locationServicesAuthorization);
    console.log('auth codes', Ti.Geolocation.AUTHORIZATION_AUTHORIZED,
        Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE,
        Ti.Geolocation.AUTHORIZATION_ALWAYS); 
    */

    // return Ti.Geolocation.locationServicesEnabled && !_.isEmpty(Alloy.Globals.userPosition);

    //condizione per cui il device ha i servizi geo abilitati
    var servizioAttivoSulDevice = Ti.Geolocation.locationServicesEnabled;
    //se ios, devo verificare che l'app abbia l'autorizzazione ad usare i servizi geo
    var appAutorizzata = OS_ANDROID || _([
        Ti.Geolocation.AUTHORIZATION_AUTHORIZED,
        Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE,
        Ti.Geolocation.AUTHORIZATION_ALWAYS,
    ]).indexOf(Ti.Geolocation.locationServicesAuthorization) > -1;

    return servizioAttivoSulDevice && appAutorizzata;
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

        if (_callback) {

            if (evt.code === 0) { //success
                lastAddress = exports.formatAddress(evt.places[0]);
                _callback(null, evt.places, lastAddress);
            } else {
                _callback(evt);
            }
        }

    });
};

exports.formatAddress = function(place) {
    return ([place.street, place.zipcode, place.city]).filter(function(e) {
        return e && e.length;
    }).join(', ');
};

/**
 * Funzione che apre le impostazioni del device alla pagina dedicata alla geolocalizzazione
 * @return {[type]} [description]
 */
exports.openLocationSettings = function() {
    console.log('openLocationSettings');
    if (OS_ANDROID) {
        var settingsIntent = Titanium.Android.createIntent({
            action: 'android.settings.LOCATION_SOURCE_SETTINGS'
        });
        Ti.Android.currentActivity.startActivity(settingsIntent);
    } else {
        //  Ti.Platform.openURL('prefs://root=LOCATION_SERVICES')
        Ti.Platform.openURL('prefs:root=LOCATION_SERVICES');
    }

};