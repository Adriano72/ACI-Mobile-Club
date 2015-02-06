exports.definition = {
    config: {

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
        _.extend(Collection.prototype, {
            // extended functions and properties go here
         /*   comparator: function(m) {
                var j = m.toJSON();
                if (j.address && j.address.distance) {
                    return j.address.distance;
                } else {
                    return j.name;
                }
            }*/
        });

        return Collection;
    }
};