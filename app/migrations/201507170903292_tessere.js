/*
	Aggiornamento dati delle tessere
	Il prezzo delle tessere sitema cambia da 79 a 75
 */

migration.up = function(migrator) {

    var sql = 'update ' + migrator.table + " set price=75 where code='SOC'";
    migrator.db.execute(sql);

    
};

migration.down = function(migrator) {
    var sql = 'update ' + migrator.table + " set price=79 where code='SOC'";
    migrator.db.execute(sql);
};