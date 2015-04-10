/**
 * Modulo per salvare le variabili di stato dell'app
 * (come Alloy.Globals, ma ottimizzato)
 */

var utility = require('utility');


/**
 * variabile globale che identifica la sessione (intesa come avvio dell'app)
 * @type {[type]}
 */
exports.sessionUUID = utility.uuid.v4();


/**
 * Property globale che ci dice se è la prima esecuzione dell'app dopo l'installazione
 */
Object.defineProperty(exports, 'isFirstRun', {
    get: function() {
        var v = Ti.App.Properties.getBool('app-first-run');
        console.log('isFirstRun', v);
        return _.isUndefined(v) || _.isNull(v) ? true : v;
    },
    set: function(v) {
        return Ti.App.Properties.setBool('app-first-run', v);
    }
});


/**
 * Ritorna lo snapshot del sistema in questo istante
 * Utile per i log
 * @return {[type]} [description]
 */
exports.snapshot = function() {


    /**
     * PLATFORM
     */
    var platform = {};
    _(['BATTERY_STATE_CHARGING',
        'BATTERY_STATE_FULL',
        'BATTERY_STATE_UNKNOWN ',
        'BATTERY_STATE_UNPLUGGED',
        'address',
        'architecture',
        'availableMemory',
        'batteryLevel',
        'batteryMonitoring',
        'batteryState',
        'displayCaps',
        'id',
        'locale',
        'macaddress',
        'manufacturer',
        'model',
        'name',
        'netmask',
        'osname',
        'ostype',
        'processorCount',
        'runtime',
        'username',
        'version'
    ]).each(function(e) {
        var v = Ti.Platform[e];
        if (e == 'displayCaps') {
            var dc = {};
            _(['density',
                'dpi',
                'logicalDensityFactor',
                'platformHeight',
                'platformWidth',
                'xdpi',
                'ydpi'
            ]).each(function(d) {
                dc[d] = v[d];
            });
            v = dc;
        }

        platform[e] = v;

    });

    /**
     * APP
     */
    var app = {};
    _(['accessibilityEnabled',
        'deployType',
        'disableNetworkActivityIndicator',
        'forceSplashAsSnapshot',
        'guid',
        'id',
        'idleTimerDisabled',
        'installId',
        'keyboardVisible',
        'name',
        'proximityDetection',
        'proximityState',
        'sessionId',
        'version'
    ]).each(function(e) {
        var v = Ti.App[e];

        app[e] = v;

    });

    /**
     * USER
     */
    var user = {
        userInfo: require('user').getCurrentUser(),
        geo: require('locationServices').getLastLocation()
    };


    /**
     * ACIGEO
     */
    var acigeo = require('network').getAciGeoHeaders();
    acigeo.endpoint = Alloy.CFG.AciGeo_BaseUrl;


    return {
        platform: platform,
        app: app,
        user: user,
        acigeo: acigeo
    };
}