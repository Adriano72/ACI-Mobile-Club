var baseCollection = require('BaseCollection_PuntiAci');

exports.definition = {
    config: {
        type_code: 'pra',
        adapter: {
            type: "properties",
            collection_name: "pra"
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