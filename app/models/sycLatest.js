var baseCollection = _.extend({}, require('BaseCollection_VantaggiSoci'), {
    /**
     * Il metodo usato per richiamare i dati dal web server
     * Mantengo la firma della funzione degli altri casi, anche se il primo parametro (il type_code) lo posso ignorare
     * @param  {}   ignoredParameter    parametro da ignorare
     * @param  {Function} cb            callback nella forma (err, result)
     */
    retrieve_method: function(ignoredArgument, cb) {
        console.log('sycLatest retrieve_method ', this.fromDate);
        //data di riferimento
        var dateFrom = (function() {
            var now7;
            if (this.dateFrom) {
                console.log('--1');
                now7 = this.fromDate;

            } else {
                console.log('--2');

                //la data di riferimento è la mezzanotte del giorno corrispondente a N giorni fa
                var N = 7;
                var now = new Date();
                //   now7 = new Date((new Date()).setDate(now.getDate() - N));
                now7 = (new Date()).setDate(now.getDate() - N);
                now7 = new Date(now7);
            }

            // console.log('now7', now7);
            var d = new Date(now7.getFullYear(), now7.getMonth(), now7.getDate(), 0, 0, 0);

            /*     console.log.apply(this, _([now, now7, d]).map(function(e) {
                return e.toString();
            })); */

            console.log('--3', d);
            return d;

        })();

        //  console.log('sycLatest retrieve_method');
        require('network').sycLatest(dateFrom, function() {
            var args = Array.prototype.slice.call(arguments);
            console.log('sycLatest retrieve_method cb', args);
            var data = args[1];
            cb && cb(data);

        });
    },

    /**
     * Sovrascrivo il metodo che serve a determinare se i dati in una collection sono ancora validi o devo essere ricaricati
     * @return {Boolean} [description]
     */
    isOutdated: function() {
        console.log('sycLatest isOutdated');
        //per ora no cache
        return true;
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

        _.extend(Collection.prototype, baseCollection, {


            /**
             * Metodo setter per la proprietà fromDate
             * In pratica serve ad impostare la data di riferimento per le ricerche delle ultime convenzioni
             * @param {date} fromDate  data di riferimento delle ultime convenzioni
             */
            setDateFrom: function(fromDate) {
                this.dateFrom = fromDate;
            },


        });

        return Collection;
    }
};