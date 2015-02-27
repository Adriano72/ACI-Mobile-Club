/**
 * Questo modulo è una raccolta di metodi base da applicare alla collezione dei banner
 * Nei metodi esportati, 'this' si riferisce all'istanza della collezione
 */

var network = require('network');

//raccolta di metodi specifici delle collezioni di tipo punti aci
var banner = {
    retrieve_method: require('network').getBanner,
    fetchRandom: function(cb) {
        var coll = this;
        network.getBanner(function(result) {
            coll.reset(result);
            cb & cb();
        });




    }

};

module.exports = _.extend({}, banner);