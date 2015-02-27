var baseCollection = require('BaseCollection_Banner');

exports.definition = {
    config: {
        adapter: {
            type: "properties",
            collection_name: "banner"
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