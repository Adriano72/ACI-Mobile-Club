var baseCollection = require('BaseCollection_VantaggiSoci');

exports.definition = {
    config: {
        type_code: 'benessere_e_salute',
        adapter: {
            type: "properties",
            collection_name: "benessereSalute"
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