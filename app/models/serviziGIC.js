exports.definition = {
    config: {
        columns: {
            "gic": "TEXT",
            "declinazione": "TEXT"
        },
        adapter: {
            type: "sql",
            collection_name: "serviziGIC"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            // extended functions and properties go here
        });

        return Model;
    },
    extendCollection: function(Collection) {
        var baseInitilize = Collection.prototype.initialize;
        _.extend(Collection.prototype, {
            // extended functions and properties go here


            searchByText: function(text) {
                return this.filter(function(item) {
                    console.log(item);
                    var declinazione = item.get('declinazione' );
                    console.log(declinazione);
                    console.log(text);
                    console.log(declinazione.indexOf(text));
                    return  declinazione.indexOf(text) >= 0 ;
                });
            },

            comparator: function(m){
                return m.get('declinazione');
            }

        });

        return Collection;
    }
};