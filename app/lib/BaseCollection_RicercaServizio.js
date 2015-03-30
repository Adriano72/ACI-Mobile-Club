/**
 * Questo modulo è una raccolta di metodi base da applicare alle collezioni PuntoAci
 * Nei metodi esportati, 'this' si riferisce all'istanza della collezione
 * Nella collezione ci si aspetta che sia dichiarato il parametro 'type_code' nelle configurazioni
 */

var base = require('BaseCollection_AciGeo');



//raccolta di metodi specifici delle collezioni di tipo punti aci
var ricerca = {
    fetchIfChanged: function(servizio, fuoriGic, cb) {

        var coll = this;


        require('network').getPuntiAciPerServizioGIC(servizio, fuoriGic, function(result) {

            coll.reset(result);
            coll.onFetch();
            cb && cb(null, 0);
        });


    }
};

module.exports = _.extend({}, base, ricerca);