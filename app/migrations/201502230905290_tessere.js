migration.up = function(migrator) {

    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN buyUrl TEXT;');
    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN detailUrl TEXT;');
};
migration.down = function(migrator) {
    var db = migrator.db;
    var table = migrator.table;
    var table_bak = table + '_bak';
    var fields = ['name', 'abstract', 'slogan', 'price', 'code', 'alloy_id'];
    db.execute('CREATE TEMPORARY TABLE ' + table_bak + '( ' + fields.join(', ') + ');');
    db.execute('INSERT INTO ' + table_bak + ' SELECT ' + fields.join(', ') + ' FROM ' + table + ';');
    migrator.dropTable();
    migrator.createTable({
        "columns": {
            "name": "TEXT",
            "slogan": "TEXT",
            "abstract": "TEXT",
            "price": "REAL",
            "code": "TEXT"
        }
    });

    db.execute('INSERT INTO ' + table + ' SELECT ' + fields.join(', ') + ' FROM ' + table_bak + ';');
    db.execute('DROP TABLE ' + table_bak + ';');
};