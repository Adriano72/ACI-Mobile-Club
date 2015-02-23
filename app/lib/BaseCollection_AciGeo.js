/**
 * Questo modulo è una raccolta di metodi base da applicare alle collezioni AciGeo
 * E' un modulo astratto - va implementato nelle varie declinazioni
 * I moduli implementanti devo definire la funzione retrieve_method
 * Nei metodi esportati, 'this' si riferisce all'istanza della collezione
 * Nella collezione ci si aspetta che sia dichiarato il parametro 'type_code' nelle configurazioni
 */

//durata massima di una collection
var EXPIRY_DURATION = Alloy.CFG.AciGeo_CacheDurationHours;
//distanza massima di valità della collection. 
//  Se sto cercando per posizione e mi sono allontanato dal punto precedente di più di MAX_DISTANCE
//  la collection non è valida
var MAX_DISTANCE = Alloy.CFG.AciGeo_CacheDistanceRangeMeters;


var utility = require('utility');
var settings = require('settings');
var locationServices = require('locationServices');


//collezione di metodi base da esportare
var AciGeo = {};

//metodo network che gestisce l'aggiornamento dei punti
AciGeo.retrieve_method = function(type_code, cb) {
    throw "retrieve_method not implemented";
};


/**
 * Operazione da fare quando viene aggiornata la collezione
 * @param  {Collection} coll collezione da aggiornare
 */
AciGeo.onFetch = function() {
    console.log('on fetch');
    this.lastUpdate = new Date();
    this.lastParams = settings.ricercaPerProssimita ? locationServices.getLastLocation() : settings.provinciaDiRiferimento.shortName;
};


/**
 * Esegue il fetch dei dati dal server in maniera condizione
 * prima verifica che la collezione non sia aggiornata
 * @param  {Function} cb callback del chiamante nella forma (err, cached) dove 'err' contiene un eventuale errore e 'cached' è un booleano che dice se il contenuto proviene da cache o no
 */
AciGeo.fetchIfChanged = function(cb) {
    /*    console.log('arguments', Array.prototype.slice.call(arguments)); */
    // console.log('this', this);
    console.log('this keys', _.keys(this));
    console.log('this isOutdated', this.isOutdated);
    console.log('this reset', this.config);

    if (this.isOutdated()) {

        console.log('fetchCached 1');
        var coll = this;


        try {
            this.retrieve_method(this.config.type_code, function(result) {
                console.log('fetchCached 3');
                coll.reset(result); 
                coll.onFetch();
                cb && cb(null, 0);
            });
        } catch (e) {
            console.log('errore retrieve_method', e);
            cb && cb(e);
        }


    } else {
        console.log('fetchCached 2');
        cb && cb(null, 1);
    }

},

/**
 * Controlla se la collezione è valida o meno
 * @return {Boolean} dice se la collezione è valida o meno
 */
AciGeo.isOutdated = function() {

    var lastUpdate = this.lastUpdate;

    console.log('this.lastUpdate', lastUpdate);


    //se lastUpdate non è definito, allora è il primo update
    if (!lastUpdate) {
        console.log('isOutdated lastUpdate null');

        return true;
    }

    //controllo che sia troppo vecchia
    if (EXPIRY_DURATION && utility.dateDiff(lastUpdate, new Date(), 'h') > EXPIRY_DURATION) {
        console.log('isOutdated expired');

        return true;
    } else { //secondo: controllo che il contesto sia cambiato

        //la modalità corrente scelta dall'utente
        var currentMode = settings.ricercaPerProssimita ? 1 : 0;
        console.log('currentMode', currentMode, settings.ricercaPerProssimita);
        //la modalità dell'ultima ricerca, la capisco implicitamente dal tipo di parametri
        //  se object->sono coordinate, se string->è la provincia
        var lastMode = _.isObject(this.lastParams) ? 1 : 0;

        if (currentMode != lastMode) {
            //è il caso in cui ho cambiato criterio di ricerca, sicuramente la ricerca è da invalidare
            console.log('isOutdated cambio modalità');

            return true;
        } else {

            if (currentMode == 1) {
                //posizione

                //è il caso in cui l'ultima ricerca era stata fatta per posizione, allora devo considerare la distanza rispetto al punto attuale
                var pos = locationServices.getLastLocation();
                var last = this.lastParams;

                console.log('isOutdated posizione', pos, last);


                return utility.calculateDistance(pos.latitude, pos.longitude, last.latitude, last.longitude) > MAX_DISTANCE;

            } else {
                //provincia

                var prov = settings.provinciaDiRiferimento.shortName;
                var last = this.lastParams;

                console.log('isOutdated provincia', prov, last);
                return prov != last
            }

        }

    }

    return false;
};


module.exports = AciGeo;