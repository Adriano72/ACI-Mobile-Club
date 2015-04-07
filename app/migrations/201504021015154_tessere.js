var preload_data = [{
    "name": "ACI Gold",
    "abstract": "ACI Gold ti offre il top dell'assistenza al veicolo e dell’assistenza medico-sanitaria per te e la tua famiglia, in Italia e all’estero, a casa e in viaggio.",
    "slogan": "LA PIÙ RICCA DI SERVIZI, PER TE, LA TUA FAMIGLIA, IL TUO VEICOLO",
    "price": 99,
    "code": "GSO"
}, {
    "name": "ACI Sistema",
    "abstract": "ACI Sistema ti offre l’assistenza medico-sanitaria in Italia e all’estero e tutti i servizi di assistenza al veicolo.	",
    "slogan": "TUTTE LE SOLUZIONI IN VIAGGIO PER TE E IL TUO VEICOLO",
    "price": 79,
    "code": "DIP"
}, {
    "name": "ACI Club",
    "abstract": "La nuova ACI Club è più ricca di servizi e soluzioni alla mobilità, ti garantisce un soccorso stradale in Italia, su qualsiasi mezzo ti trovi.",
    "slogan": "LA PRIMA SOLUZIONE ALLE TUE ESIGENZE DI MOBILITÀ",
    "price": 35,
    "code": "CLU"
}, {
    "name": "ACI Storico Aderente",
    "abstract": "La tessera socio \"Aderente\" assicura tutti i servizi della tessera Vintage: assistenza a 10 veicoli, 3 soccorsi stradali gratuiti in Italia e all’estero, fino a 50 km di traino, abbonamento a \"Ruoteclassiche\" e altri benefici. La prima adesione al Club ACI Storico come socio \"Aderente\" costa 109 euro di quota annuale più 100 euro di iscrizione una tantum. Se sei già socio Vintage, la quota di iscrizione è gratuita e il rinnovo costa 109 euro.",
    "slogan": "DEDICATA AGLI AMANTI DELLE AUTO E MOTO D'EPOCA.",
    "price": 209,
    "code": "STA",
    "buyUrl": "https://servizi.aci.it/web_FA_xpay/DispatchAuthenticationServlet?action=associazione&userId=sitoAci&codiceProdotto=ISTA&codiceIniziativa=99165"
}];




migration.up = function(migrator) {

    var sql = 'delete from ' + migrator.table;
    migrator.db.execute(sql);

    for (var i = 0; i < preload_data.length; i++) {
        migrator.insertRow(preload_data[i]);
    }
};

migration.down = function(migrator) {
    migrator.dropTable();
};