var preload_data = [{
    "name": "ACI Storico Fondatore",
    "abstract": "L'adesione è soggetta alla presentazione del proprio curriculum e all'accettazione della richiesta da parte del Club. La prima adesione come socio “Fondatore” costa 500 euro di quota annuale più 500 euro di iscrizione una tantum.",
    "slogan": "LA FORMULA ASSOCIATIVA PARTICOLARMENTE ESCLUSIVA DEL CLUB ACI STORICO",
    "price": 1000,
    "buyUrl": "https://servizi.aci.it/web_FA_xpay/DispatchAuthenticationServlet?action=associazione&userId=sitoAci&codiceProdotto=ISTF&codiceIniziativa=99165&codiceProdotto=ISTF",
    "code": "STF"
}];


migration.up = function(migrator) {

    for (var i = 0; i < preload_data.length; i++) {
        migrator.insertRow(preload_data[i]);
    }
};

migration.down = function(migrator) {
    for (var i = 0; i < preload_data.length; i++) {
        migrator.deleteRow(preload_data[i]);
    }
};