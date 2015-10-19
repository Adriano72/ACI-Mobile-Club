var baseCollection = _.extend({}, require('BaseCollection_VantaggiSoci'), {
    /**
     * Il metodo usato per richiamare i dati dal web server
     * Mantengo la firma della funzione degli altri casi, anche se il primo parametro (il type_code) lo posso ignorare
     * @param  {}   ignoredParameter    parametro da ignorare
     * @param  {Function} cb            callback nella forma (err, result)
     */
    retrieve_method: function(ignoredArgument, cb) {
        //data di riferimento
        var fromDate = (function() {
            //la data di riferimento è la mezzanotte del giorno corrispondente a N giorni fa
            var N = 7;
            var now = new Date();
            var now7 = (new Date()).setDate(now.getDate() - N);
            var d = new Date(now7.getYear(), now7.getMonth(), now7.getDate(), 0, 0, 0);

            console.log.apply(this, _([now, now7, d]).map(function(e) {
                return e.toString();
            }));

            return d;

        })();

        console.log('sycLatest retrieve_method');
        require('network').sycLatest(fromDate, cb);
    }
});



exports.definition = {
    config: {
        type_code: 'sycLatest',
        adapter: {
            type: "properties",
            collection_name: "sycLatest"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            // extended functions and properties go here
        });

        return Model;
    },
    extendCollection: function(Collection) {

        _.extend(Collection.prototype, baseCollection, {});

        return Collection;
    }
};