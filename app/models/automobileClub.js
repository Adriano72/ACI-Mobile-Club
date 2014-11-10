exports.definition = {
	config : {
		columns : {
			"name" : "string",
			"indirizzo" : "string",
			"cap" : "varchar",
			"citta" : "string",
			"latitudine" : "varchar",
			"longitudine" : "varchar",
			"telefono" : "text",
			"fax" : "text",
			"sito_web" : "text",
			"email" : "string"
		},
		adapter : {
			type : "sql",
			collection_name : "automobileClub"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection : function(Collection) {

		// helper functions
		function S4() {
			return (0 | 65536 * (1 + Math.random())).toString(16).substring(1);
		}

		function guid() {
			return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
		}


		_.extend(Collection.prototype, {

			deleteAll : function() {

				var collection = this;

				var sql = "DELETE FROM " + collection.config.adapter.collection_name;
				db = Ti.Database.open(collection.config.adapter.db_name);
				db.execute(sql);
				db.close();

				collection.trigger('sync');

			},

			saveAll : function() {
				var collection = this;

				var dbName = collection.config.adapter.db_name;
				var table = collection.config.adapter.collection_name;
				var columns = collection.config.columns;

				db = Ti.Database.open(dbName);
				db.execute("BEGIN;");

				collection.each(function(model) {

					if (!model.id) {
						model.id = guid();
						model.attributes[model.idAttribute] = model.id;
					}

					var names = [],
					    values = [],
					    q = [];
					for (var k in columns) {
						names.push(k);
						values.push(model.get(k));
						q.push("?");
					}
					var sqlInsert = "INSERT INTO " + table + " (" + names.join(",") + ") VALUES (" + q.join(",") + ");";

					db.execute(sqlInsert, values);

				});

				db.execute("COMMIT;");
				db.close();

				collection.trigger('sync');
			}
		});

		return Collection;
	}
}; 