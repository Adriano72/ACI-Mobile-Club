var baseCollection = require('BaseCollection_VantaggiSoci');

exports.definition = {
	config: {
        type_code: 'tempo_libero_benessere',
		adapter: {
			type: "properties",
			collection_name: "tempoLibero"
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