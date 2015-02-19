var baseCollection = require('BaseCollection_Demolitori');

exports.definition = {
    config: {
        type_code: 'dem',
        adapter: {
            type: "properties",
            collection_name: "demolitori"
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