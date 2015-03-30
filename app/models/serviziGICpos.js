var baseCollection = require('BaseCollection_RicercaServizio');

exports.definition = {
    config: {
        type_code: 'ric',
        adapter: {
            type: "properties",
            collection_name: "serviziGICpos"
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