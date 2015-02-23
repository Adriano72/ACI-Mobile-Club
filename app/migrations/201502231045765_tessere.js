/**
 * File di migrazione per l'aggiunta della tessera ACI Storico Aderente
 */

var data = [{
    "name": "ACI Storico Aderente",
    "abstract": "La tessera socio \"Aderente\" assicura tutti i servizi della tessera Vintage: assistenza a 10 veicoli, 3 soccorsi stradali gratuiti in Italia e all’estero, fino a 50 km di traino, abbonamento a \"Ruoteclassiche\" e altri benefici. La prima adesione al Club ACI Storico come socio \"Aderente\" costa 109 euro di quota annuale più 100 euro di iscrizione una tantum. Se sei già socio Vintage, la quota di iscrizione è gratuita e il rinnovo costa 109 euro.",
    "slogan": "DEDICATA AGLI AMANTI DELLE AUTO E MOTO D'EPOCA.",
    "price": 209,
    "code": "STA",
    "buyUrl" : "https://servizi.aci.it/web_FA_xpay/DispatchAuthenticationServlet?action=associazione&userId=sitoAci&codiceProdotto=ISTA&codiceIniziativa=99165"
}];


migration.up = function(migrator) {
    for (var i = 0; i < data.length; i++) {
        migrator.insertRow(data[i]);
    }
};

migration.down = function(migrator) {
    for (var i = 0; i < data.length; i++) {
        migrator.deleteRow(data[i]);
    }
};