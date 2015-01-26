/**
 * Modulo che raccoglie le funzionalità relative al servizio AciGlobal
 * Richiede le seguenti configurazioni in config.json:
 * "AciGlobal_NumeroVerde"
 * "AciGlobal_ServiceLogin"
 * "AciGlobal_ServicePassword"
 */

var rest = require('rest');

var endpoint = Alloy.CFG.AciGlobal_ServiceEndpoint;

exports.sendRichiestaAssistenza = function(params, callback) {

    function formatRequestParams(params) {

        return {
            data: {
                "user": {
                    "username": Alloy.CFG.AciGlobal_ServiceLogin, // username applicativa, sarà da sostituire
                    "password": Alloy.CFG.AciGlobal_ServicePassword // password applicativa, sarà da sostituire
                },
                "assistenza": {
                    "nome": params.nome || "ACI",
                    "cognome": params.cognome || "MOBILE CLUB",
                    "numTelefono": params.telefono, // senza prefisso internazionale!!!
                    "codUnivocoTelefono": params.userId || Ti.Platform.id, // vedi sotto
                    "targa": "AA111AA",
                    "telaio": params.tesseraACI || "ZAFA1234651356565", // la tessera ACI o un altro identificativo per l'utente (es. Codice fiscale)
                    "marca": "ACI",
                    "modello": "MOBILE CLUB",
                    "codApplicazione": "HMM01", // codice applicativo, sarà da sostituire
                    "consGPS": "1", // consenso al trattamento dei dati GPS, se "1" i dati GPS non potranno essere utilizzati
                    "latitudine": params.latitude,
                    "longitudine": params.longitude,
                    "tipoRichiestaAssistenza": "1", // 1 ==> Guasto / 2 ==> Incidente
                    "note": params.note
                }
            }
        };

    }

    var url = endpoint + '/assistenza/_req';
    console.log('request: ', url);
    rest.get(url, formatRequestParams(params), callback);


};

exports.NumeroVerde = Alloy.CFG.AciGlobal_NumeroVerde;
exports.RequestLimitMinutes = Alloy.CFG.AciGlobal_RequestLimitMinutes;

/**
 * Gestisce il limite temporale per inviare richieste ad AciGlobal
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
exports.limitRequests = function(msg, cb) {
    var key = 'AciGlobal:RequestFromDate';
    var now = new Date();
    var validFrom = Ti.App.Properties.getObject(key);
    if (!validFrom || validFrom <= now) {
        Ti.App.Properties.setObject(key, new Date(now.getTime() + Alloy.CFG.AciGlobal_RequestLimitMinutes * 60000));
        cb && cb();
    } else {
        alert(msg);
    }
};