/**
 * Questo modulo è una raccolta di metodi base da applicare alla collezione dei banner
 * Nei metodi esportati, 'this' si riferisce all'istanza della collezione
 */

//raccolta di metodi specifici delle collezioni di tipo punti aci
var banner = {
    retrieve_method: require('network').getBanner,
    fetchRandom: function(cb) {
        var coll = this;
        require('network').getBanner(function(p_data) {
            Alloy.Collections.banner.reset(p_data);
            cb && cb(p_data);
        });



    }

};

module.exports = _.extend({}, banner);