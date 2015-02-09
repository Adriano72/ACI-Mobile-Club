exports.definition = {
    config: {

        adapter: {
            type: "properties",
            collection_name: "province"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            // extended functions and properties go here
        });

        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            // extended functions and properties go here

            comparator: function(m) {
                return m.get('longName');
            }
        });

        return Collection;
    }
};