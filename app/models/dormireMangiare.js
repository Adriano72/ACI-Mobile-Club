var baseCollection = require('BaseCollection_VantaggiSoci');

exports.definition = {
	config: {
        type_code: 'dormire_mangiare',
		adapter: {
			type: "properties",
			collection_name: "dormireMangiare"
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