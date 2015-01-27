/**
 * Modulo che raccoglie le funzionalità relative al servizio AciGlobal
 * Richiede le seguenti configurazioni in config.json:
 * "AciGlobal_NumeroVerde"
 * "AciGlobal_CodiceApplicazione"
 * "AciGlobal_ServiceLogin"
 * "AciGlobal_ServicePassword"
 * "AciGlobal_RequestLimitMinutes"
 */

var rest = require('rest');

var endpoint = Alloy.CFG.AciGlobal_ServiceEndpoint;


/**
 * Esegue una chiamata al servizio AciGlobal per richiedere assistenza
 * @param  {object}   params   hashset di parametri forniti dal chiamante
 * @param  {Function} callback funzione callback nella forma (err, result)
 */
exports.sendRichiestaAssistenza = function(params, callback) {

    /**
     * sub-routine che formatta la richiesta secondo le specifiche AciGLobal
     * @param  {object} params parametri forniti dal chiamante
     * @return {object}        oggetto JSON formattato secondo le specifiche AciGlobal
     */
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
                    "numTelefono": formatNumTelefono(params.telefono), // senza prefisso internazionale!!!
                    "codUnivocoTelefono": getCodUnivocoTelefono(), // vedi sotto
                    "targa": "AA111AA",
                    "telaio": params.tesseraACI || "ZAFA1234651356565", // la tessera ACI o un altro identificativo per l'utente (es. Codice fiscale)
                    "marca": "ACI",
                    "modello": "MOBILE CLUB",
                    "codApplicazione": Alloy.CFG.AciGlobal_CodiceApplicazione,
                    "consGPS": "1", // consenso al trattamento dei dati GPS, se "1" i dati GPS non potranno essere utilizzati
                    "latitudine": params.latitude.toFixed(6),
                    "longitudine": params.longitude.toFixed(6),
                    "tipoRichiestaAssistenza": "1", // 1 ==> Guasto / 2 ==> Incidente
                    "note": params.note
                }
            }
        };

    }

    /**
     * sub-routine che ritorna l'univoco del device secondo le specifiche AciGlobal
     * @return {string} codice univoco del telefono
     */
    function getCodUnivocoTelefono() {
        var id = Ti.Platform.id;
        var code;
        if (OS_IOS) {
            code = 'I@' + id;
        } else if (OS_ANDROID) {
            code = 'A@' + id;
        } else {
            //caso che non si verifica
        }

        return code;
    }

    /**
     * sub-routine che formatta i numeri telefonici secondo le specifiche AciGlobal
     * @param  {string} telefono telefono originale
     * @return {string}          telefono formattato
     */
    function formatNumTelefono(telefono) {
        telefono = telefono || "";

        //completo di prefisso e senza spazi, barre o altri separatori


        //rimuovo eventuali spazi e separatori
        telefono = telefono.replace(/[\s.\-\/\\]*/gi, '');

        //rimuovo eventuale prefisso internazionale
        // solo quello italiano però
        telefono = telefono.replace(/^(00|\+)39/, '');

        return telefono;
    }

    var url = endpoint + '/assistance/_req';
    console.log('request: ', url);
    console.log('params: ', params);

    //url = endpoint + '/assistance/_req?data=%7B%22user%22%3A%7B%22username%22%3A%22ACI_Mob_App%22%2C%22password%22%3A%22aci123456%22%7D%2C%22assistenza%22%3A%7B%22nome%22%3A%22MASSIMO%22%2C%22cognome%22%3A%22CHIERCHINI%22%2C%22numTelefono%22%3A%223289769508%22%2C%22codUnivocoTelefono%22%3A%22I%4004D64981-21AC-48BE-B155-08A6A551BCF5%22%2C%22targa%22%3A%22AA111AA%22%2C%22telaio%22%3A%22AC900932465%22%2C%22marca%22%3A%22ACI%22%2C%22modello%22%3A%22MOBILE%20CLUB%22%2C%22codApplicazione%22%3A%22ACI03%22%2C%22consGPS%22%3A%221%22%2C%22latitudine%22%3A%2241,808979%22%2C%22longitudine%22%3A%2212,436520%22%2C%22tipoRichiestaAssistenza%22%3A%221%22%7D%7D';

    rest.get(url, formatRequestParams(params), callback, {
        'Authorization': rest.formatBasicAuthentication(Alloy.CFG.AciGlobal_ServerLogin, Alloy.CFG.AciGlobal_ServerPassword)
        //'Authorization': 'Basic ' + Titanium.Utils.base64encode('acimobileclub' + ':' + 'Iniziale$01')
    });
    //
    //get(callback);


};


function get(_callback) {

    //Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.errorCode == "000") {
            Ti.API.info("RISPOSTA: " + " " + JSON.stringify(json));
            _callback(null, json.result);

        } else {
            //  Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
            _callback(json);
        };

    };

    xhr.onerror = function(e) {


        //  Alloy.Globals.loading.hide();

        // Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
        e.message = this.message;
        _callback(e);
    };

    //  Ti.API.info("CHIAMATA HTTP: " + Alloy.Globals.baseURL + '/aci/pos?query={"_type":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 0.2 } }&limit=15');

    var url = endpoint + '/assistance/_req?data=%7B%22user%22%3A%7B%22username%22%3A%22ACI_Mob_App%22%2C%22password%22%3A%22aci123456%22%7D%2C%22assistenza%22%3A%7B%22nome%22%3A%22MASSIMO%22%2C%22cognome%22%3A%22CHIERCHINI%22%2C%22numTelefono%22%3A%223289769508%22%2C%22codUnivocoTelefono%22%3A%22I%4004D64981-21AC-48BE-B155-08A6A551BCF5%22%2C%22targa%22%3A%22AA111AA%22%2C%22telaio%22%3A%22AC900932465%22%2C%22marca%22%3A%22ACI%22%2C%22modello%22%3A%22MOBILE%20CLUB%22%2C%22codApplicazione%22%3A%22ACI03%22%2C%22consGPS%22%3A%221%22%2C%22latitudine%22%3A%2241,808979%22%2C%22longitudine%22%3A%2212,436520%22%2C%22tipoRichiestaAssistenza%22%3A%221%22%7D%7D';

    xhr.open('GET', url);

    var uname = 'acimobileclub';
    var pass = 'Iniziale$01';
    authstr = 'Basic ' + Titanium.Utils.base64encode(uname + ':' + pass);

    xhr.setRequestHeader('Authorization', authstr);

    xhr.send();

};

/**
 * Numero verde del servizio AciGlobal
 * @type {string}
 */
exports.NumeroVerde = Alloy.CFG.AciGlobal_NumeroVerde;

/**
 * Periodo di tempo da far passare tra una richiesta e l'altra, in minuti
 * @type {number}
 */
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