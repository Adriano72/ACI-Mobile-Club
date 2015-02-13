var preload_data = [{
    "name": "ACI Gold",
    "abstract": "ACI Gold ti offre il top dell'assistenza: soccorso stradale gratuito in Italia e all'estero nei paesi U.E., in Svizzera, Norvegia, Serbia, Montenegro, Marocco, Tunisia; illimitato sull'auto associata e 2 volte su altre auto; assistenza nelle emergenze domestiche e in viaggio.",
    "slogan": "LA PIÙ RICCA DI SERVIZI, LA PIÙ COMPLETA.",
    "price": 99,
    "code": "GSO"
}, {
    "name": "ACI Sistema",
    "abstract": "ACI Sistema ti offre tutti i servizi di assistenza tecnica: soccorso stradale gratuito in Italia e nella U.E.; auto sostituiva in caso di immobilizzo o furto del \"veicolo associato\", servizio \"Medico Pronto\" in viaggio ed altre agevolazioni.",
    "slogan": "LA PIÙ DIFFUSA, QUELLA \"STORICA\".",
    "price": 79,
    "code": "DIP"
}, {
    "name": "ACI Okkei",
    "abstract": "ACI OKKEI ti offre la sicurezza dei servizi di assistenza tecnica e tante opportunità per il tuo tempo libero. Due soccorsi stradali gratuiti in Italia, qualsiasi mezzo tu stia guidando; spese di viaggio o pernottamento se il veicolo non è riparabile in giornata; tutti gli sconti e i servizi per i soci ACI.",
    "slogan": "IDEATA PER I PIÙ GIOVANI.",
    "price": 49,
    "code": "GIO"
}, {
    "name": "ACI One",
    "abstract": "ACI One è la tessera che ti offre il soccorso stradale nella tua regione. Ti offre un soccorso stradale gratuito, qualsiasi mezzo tu stia guidando; tutti gli sconti e i servizi riservati ai soci ACI.",
    "slogan": "RISERVATA A CHI UTILIZZA L'AUTO O LA MOTO PER I PICCOLI SPOSTAMENTI.",
    "price": 45,
    "code": "UNO"
}, {
    "name": "ACI Club",
    "abstract": "ACI Club è per chi non ha bisogno dell'assistenza ACI ma vuole beneficiare di tutti i privilegi del Club: tariffe di soccorso stradale scontate; sconto di 20,00 euro sull'acquisto di ACI Gold o Sistema; sconti riservati ai soci ACI.",
    "slogan": "LA PIÙ ECONOMICA PER ENTRARE NEL CLUB.",
    "price": 30,
    "code": "CLU"
}];




migration.up = function(migrator) {
    migrator.createTable({
        "columns": {
            "name": "TEXT",
            "slogan": "TEXT",
            "abstract": "TEXT",
            "price": "FLOAT",
            "code": "TEXT",
            "name": "TEXT"
        }
    });
    for (var i = 0; i < preload_data.length; i++) {
        migrator.insertRow(preload_data[i]);
    }
};

migration.down = function(migrator) {
    migrator.dropTable();
};