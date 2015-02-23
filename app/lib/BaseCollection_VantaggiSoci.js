/**
 * Questo modulo è una raccolta di metodi base da applicare alle collezioni VantaggiSoci
 * Nei metodi esportati, 'this' si riferisce all'istanza della collezione
 * Nella collezione ci si aspetta che sia dichiarato il parametro 'type_code' nelle configurazioni
 */

var base = require('BaseCollection_AciGeo');


//raccolta di metodi specifici delle collezioni di tipo vantaggi
var vantaggi = {
    retrieve_method: require('network').getVantaggiSoci
};

module.exports = _.extend({}, base, vantaggi);